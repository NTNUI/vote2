import { axiosNotIntercepted } from "./axiosIntercept";

export const login = (phone_number: string, password: string) => {
  return axiosNotIntercepted.post("/auth/login", {
    phone_number: phone_number,
    password: password,
  });
};

export const refreshAccessToken = () => {
  return axiosNotIntercepted.get("/auth/token/refresh");
};
