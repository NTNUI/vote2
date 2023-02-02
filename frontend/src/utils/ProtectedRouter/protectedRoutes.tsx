import { Outlet, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie'


export const ProtectRoutes = () => {
    const cookie = new Cookies()
    return cookie.get("accessToken") ? <Outlet/> : <Navigate to="/"/>
    

}