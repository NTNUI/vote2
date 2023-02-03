import { Outlet, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';


export const ProtectRoutes = () => {
    
    return Cookies.get("accessToken") ? <Outlet/> : <Navigate to="/"/>
    

}