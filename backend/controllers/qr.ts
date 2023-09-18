import { Response } from "express";
import { Assembly } from "../models/assembly";
import { Log } from "../models/log";
import { User } from "../models/user";
import { logActionTypes } from "../types/log";
import { RequestWithNtnuiNo } from "../utils/request";
import {
  notifyOneParticipant,
  notifyOrganizers,
} from "../utils/socketNotifier";
import { decrypt, encrypt } from "../utils/crypto";

export async function getQRData(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    return res.status(200).json({
      QRData: encrypt(
        JSON.stringify({ ntnuiNo: req.ntnuiNo, timestamp: Date.now() })
      ),
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function assemblyCheckin(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const representsGroup = req.body.representsGroup || "unknown";
  console.log(representsGroup);
  const { ntnuiNo, timestamp } = JSON.parse(decrypt(req.body.QRData));
  const organizerUser = await User.findById(req.ntnuiNo);

  if (
    organizerUser &&
    organizerUser.groups.some(
      (membership) => membership.organizer && membership.groupSlug == group
    )
  ) {
    try {
      const scannedUser = await User.findById(ntnuiNo);

      // If user is logged in, the correct userID is provided,
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
            notifyOneParticipant(
              scannedUser._id,
              JSON.stringify({ status: "checkout", group: group })
            );

            // Create log of user leaving
            if (group == "main-assembly") {
              await Log.create({
                assemblyID: group,
                representsGroup: representsGroup,
                action: logActionTypes.checkout,
                user: scannedUser.id,
              });
            }

            // Notify organizers of user leaving
            notifyOrganizers(group, JSON.stringify({ participants: -1 }));

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
            notifyOneParticipant(
              scannedUser._id,
              JSON.stringify({ status: "verified", group: group })
            );

            // Create log of entry
            if (group == "main-assembly") {
              await Log.create({
                assemblyID: group,
                representsGroup: representsGroup,
                action: logActionTypes.checkin,
                user: scannedUser.id,
              });
            }

            // Notify organizers of user entering
            notifyOrganizers(group, JSON.stringify({ participants: 1 }));

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
      return res
        .status(401)
        .json({ message: "Something went wrong (Invalid credentials?)" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}
