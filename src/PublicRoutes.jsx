import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux";

export default function PublicRoutes(){
    const token = useSelector(state => state.user.token);
    return(
        token ? <Navigate to="/" /> : <Outlet />
    );
}