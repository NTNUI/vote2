import axios from "axios";

export const getGroups = () => {
  return axios.get("/user/userData", { withCredentials: true });
};
