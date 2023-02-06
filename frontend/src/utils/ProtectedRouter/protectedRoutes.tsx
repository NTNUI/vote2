import { Outlet, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

export const ProtectRoutes = () => {
    return localStorage.getItem("isLoggedIn") == "true" ? <Outlet/> : <Navigate to="/"/>
}
