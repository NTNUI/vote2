import { Outlet, Navigate } from "react-router-dom";

export const ProtectRoutes = () => {
  return localStorage.getItem("isLoggedIn") == "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
