import { Outlet, Navigate } from "react-router-dom";
import { Login } from "../../pages/Login";


export const ProtectRoutes = () => {
    const Auth = localStorage.getItem("Auth")

    return Auth == "true" ? <Outlet/> : <Navigate to="/"/>
    

}