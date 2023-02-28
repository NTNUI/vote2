import { Response } from "express";
import { getNtnuiProfile, refreshNtnuiToken } from "ntnui-tools";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { notifyOne } from "./assemblyStatus";

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
          await Assembly.findByIdAndUpdate(
            { _id: group },
            { $addToSet: { participants: Number(scannedUser._id) } }
          );
          notifyOne(scannedUser._id, "Godkjent checkin");
          return res.status(200).json({ message: "Check-in successful" });
        }
      }
    } catch (e) {
      return res.status(401).json({ message: "Invalid token in body" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function assemblyCheckout(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const token = req.body.token;
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

      // If user is logged inn, the correct token is provided
      if (scannedUser) {
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
          await Assembly.findByIdAndUpdate(
            { _id: group },
            { $pull: { participants: Number(scannedUser._id) } }
          );
          return res.status(200).json({ message: "Check-out successful" });
        }
      }
    } catch (e) {
      return res.status(401).json({ message: "Invalid token in body" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}
