import { Request, Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { UserDataGroupType, UserDataResponseType } from "../types/user";
import { RequestWithNtnuiNo } from "../utils/request";

export async function getUserData(
  req: RequestWithNtnuiNo,
  res: Response<UserDataResponseType | { message: string }>
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.ntnuiNo);

  let userData: UserDataResponseType;
  let userDataGroups: UserDataGroupType[] = [];

  if (user) {
    userData = {
      firstName: user.first_name,
      lastName: user.last_name,
      groups: [],
      isOrganizer: false,
    };

    user.groups.forEach((membership) => {
      // TODO:
      // const assembly = Assembly.findById(membership.groupName);
      let active: boolean = false;

      userDataGroups.push({
        groupName: membership.groupName,
        role: membership.role,
        hasActiveAssembly: active,
      });

      if ((membership.role === "leader", "cashier", "deputy_leader")) {
        userData.isOrganizer = true;
      }
    });

    userData.groups = userDataGroups;

    return res.status(200).json(userData);
  }

  return res.status(401).json({ message: "Unauthorized" });
}
