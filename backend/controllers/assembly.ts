import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { isGroupOrganizer } from "./user";

export async function createAssembly(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) =>
          isGroupOrganizer(membership) && membership.groupName == group
      )
    ) {
      await Assembly.findByIdAndUpdate(
        group,
        { $set: { isActive: false, participants: 0 } },
        { upsert: true }
      );
      return res.status(200).json({ message: "Assembly succefully created" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to create this assembly" });
}
