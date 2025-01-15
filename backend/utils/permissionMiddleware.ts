import { Organizer } from "../models/organizer";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "./request";
import { Response, NextFunction } from "express";

export async function isOrganizer(
  req: RequestWithNtnuiNo,
  res: Response,
  next: NextFunction
) {
  /**
   * This is a middleware function that checks if the user is an organizer of a given group.
   * If the user is an organizer, the function calls the next function for the route.
   * If the user is not an organizer, the function returns a 403 Forbidden response.
   *
   * The request must contain the groupSlug either in the body or in the parameters.
   * If the user is an organizer for the given group, the user gets access.
   */
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const groupSlug = req.body.groupSlug || req.params.groupSlug;
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
    const extraOrganizer = await Organizer.exists({
      ntnui_no: req.ntnuiNo,
      assembly_id: groupSlug,
    });
    if (extraOrganizer) {
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
  const groupSlug = req.body.groupSlug || req.params.groupSlug;
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
