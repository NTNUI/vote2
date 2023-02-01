import { Outlet, Navigate } from "react-router-dom";
import { Login } from "../../pages/login";


export const ProtectRoutes = () => {
    const Auth = sessionStorage.getItem("Auth")

    return Auth == "true" ? <Outlet/> : <Navigate to="/"/>
    

}