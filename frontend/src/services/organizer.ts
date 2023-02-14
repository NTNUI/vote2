import axios from "axios";
import { UserDataResponseType } from "../types/user";

export const getGroups = async (): Promise<UserDataResponseType> => {
  return axios.get("/user/userData", { withCredentials: true });
};
