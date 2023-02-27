import { User } from "../models/user";

export const groupOrganizers = () => {
  return ["board_member", "leader", "cashier", "deputy_leader"];
};

export const getNameById = async (id: number) => {
  try {
    const user = await User.findById(id);

    return user?.first_name + " " + user?.last_name;
  } catch (error) {
    return null;
  }
};
