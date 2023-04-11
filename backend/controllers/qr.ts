import { Response } from "express";
import { getNtnuiProfile, refreshNtnuiToken } from "ntnui-tools";
import { Assembly } from "../models/assembly";
import { Log } from "../models/log";
import { User } from "../models/user";
import { logActionTypes } from "../types/log";
import { RequestWithNtnuiNo } from "../utils/request";
import { notifyOne } from "../utils/socketNotifier";

export async function getToken(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { refreshToken } = req.cookies;
    // Refresh token to ensure token is fresh (maximum lifespan).
    const accessToken = await refreshNtnuiToken(refreshToken);
    return res
      .cookie("accessToken", accessToken.access, {
        maxAge: 1800000, // 30 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      })
      .status(200)
      .json(accessToken);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function assemblyCheckin(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const token = req.body.token;
  const timestamp = req.body.timestamp;
  const user = await User.findById(req.ntnuiNo);

  if (
    user &&
    user.groups.some(
      (membership) => membership.organizer && membership.groupSlug == group
    )
  ) {
    try {
      const scannedUser = await User.findById(
        (
          await getNtnuiProfile(token)
        ).data.ntnui_no
      );

      // If user is logged inn, the correct token is provided,
      // and timestamp is less than 15 seconds ago and not negative (created before current time)
      if (
        scannedUser &&
        Date.now() - timestamp < 15000 &&
        Date.now() - timestamp > 0
      ) {
        if (
          scannedUser.groups.some((membership) => membership.groupSlug == group)
        ) {
          const assembly = await Assembly.findById(group);

          if (assembly == null || !assembly.isActive) {
            return res.status(400).json({
              message:
                "There is currently no active assembly on the given group",
            });
          }

          // Check if there is an ongoing votation. User may not check-in or out during this time.
          if (assembly.currentVotation) {
            return res.status(400).json({
              message:
                "There is an ongoing votation. You may not enter or leave during this",
            });
          }

          // Check if scanned user is already checked-in, then check-out.
          if (assembly.participants.includes(scannedUser._id)) {
            await Assembly.findByIdAndUpdate(
              { _id: group },
              { $pull: { participants: Number(scannedUser._id) } }
            );
            // Notify user when QR is scanned
            notifyOne(
              scannedUser._id,
              JSON.stringify({ status: "checkout", group: group })
            );

            // Create log of user leaving
            await Log.create({
              assemblyID: group,
              action: logActionTypes.checkout,
              user: scannedUser,
            });

            return res.status(200).json({
              message:
                "Check-out successful for " +
                scannedUser.first_name +
                " " +
                scannedUser.last_name,
            });
          } else {
            await Assembly.findByIdAndUpdate(
              { _id: group },
              { $addToSet: { participants: Number(scannedUser._id) } }
            );

            // Notify user when QR is scanned
            notifyOne(
              scannedUser._id,
              JSON.stringify({ status: "verified", group: group })
            );

            // Create log of entry
            await Log.create({
              assemblyID: group,
              action: logActionTypes.checkin,
              user: scannedUser,
            });

            return res.status(200).json({
              message:
                "Check-in successful for " +
                scannedUser.first_name +
                " " +
                scannedUser.last_name,
            });
          }
        }
      }
    } catch (e) {
      return res.status(401).json({ message: "Invalid token in body" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}
