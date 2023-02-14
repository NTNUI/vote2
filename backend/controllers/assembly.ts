import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { isGroupOrganizer } from "../utils/user";

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
        { $set: { isActive: false, participants: 0, createdBy: Number(req.ntnuiNo) } },
        { upsert: true }
      );
      return res.status(200).json({ message: "Assembly successfully created" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to create this assembly" });
}

export async function editAssembly(req: RequestWithNtnuiNo, res: Response) {
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
        { $set: { isActive: req.body.isActive, participants: 0 } },
        { upsert: true }
      );
      return res.status(200).json({ message: "Assembly successfully updated" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to edit this assembly" });
}

export async function deleteAssembly(req: RequestWithNtnuiNo, res: Response) {
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
      await Assembly.findByIdAndRemove(group);
      return res.status(200).json({ message: "Assembly successfully deleted" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to delete this assembly" });
}
