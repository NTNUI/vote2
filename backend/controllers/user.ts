import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import {
  GroupType,
  UserDataGroupType,
  UserDataResponseType,
} from "../types/user";
import { RequestWithNtnuiNo } from "../utils/request";

export function isGroupOrganizer(membership: GroupType) {
  return ["leader", "cashier", "deputy_leader"].includes(membership.role);
}

export async function getUserData(
  req: RequestWithNtnuiNo,
  res: Response<UserDataResponseType | { message: string }>
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.ntnuiNo);

  let userData: UserDataResponseType;
  const userDataGroups: UserDataGroupType[] = [];

  if (user) {
    userData = {
      firstName: user.first_name,
      lastName: user.last_name,
      groups: [],
      isOrganizer: false,
    };

    for (const membership of user.groups) {
      let role = "member";
      if (isGroupOrganizer(membership)) {
        userData.isOrganizer = true;
        role = "organizer";
      }

      const assembly = await Assembly.exists({ _id: membership.groupName });

      userDataGroups.push({
        groupName: membership.groupName,
        role: role,
        hasActiveAssembly: assembly ? true : false,
      });
    }
    userData.groups = userDataGroups;

    return res.status(200).json(userData);
  }
  return res.status(401).json({ message: "Unauthorized" });
}
