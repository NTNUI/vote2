import { User } from "../models/user";
import { GroupType } from "../types/user";

export const isGroupOrganizer = (membership: GroupType) => {
  return ["leader", "cashier", "deputy_leader"].includes(membership.role);
};

export const getNameById = async (id: number) => {
  try {
    const user = await User.findById(id);

    return user?.first_name + " " + user?.last_name;
  } catch (error) {
    return null;
  }
};
