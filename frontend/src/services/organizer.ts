import axios from "axios";
import { UserDataResponseType } from "../types/user";

export const getUserData = async (): Promise<UserDataResponseType> => {
  return (await axios.get("/user/userData", { withCredentials: true })).data;
};
