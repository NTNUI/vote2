import { userRole } from "../enums/userRole";

export type UserType = {
  _id: number;
  first_name: string;
  last_name: string;
  groups: GroupType[];
};

export type GroupType = {
  groupName: string;
  role: string;
};
