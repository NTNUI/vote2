import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";

export async function createAssembly(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);
  console.log(user);

  if (user) {
    let check = false;
    user.groups.forEach((membership) => {
      if (
        ["leader", "cashier", "deputy_leader"].includes(membership.role) &&
        membership.groupName == group
      ) {
        check = true;
      }
    });
    if (check) {
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
