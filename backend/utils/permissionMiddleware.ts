import { User } from "../models/user";
import { RequestWithNtnuiNo } from "./request";
import { Response, NextFunction } from "express";

export async function isOrganizer(
  req: RequestWithNtnuiNo,
  res: Response,
  next: NextFunction
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const groupSlug = req.body.groupSlug;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) =>
          membership.organizer && membership.groupSlug == groupSlug
      )
    ) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You need to be an organizer to perform this action" });
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function isMember(
  req: RequestWithNtnuiNo,
  res: Response,
  next: NextFunction
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const groupSlug = req.body.groupSlug;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (user.groups.some((membership) => membership.groupSlug == groupSlug)) {
      return next();
    }
    return res.status(403).json({
      message:
        "You need to be a member of the given group to perform this action",
    });
  }
  return res.status(401).json({ message: "Unauthorized" });
}
