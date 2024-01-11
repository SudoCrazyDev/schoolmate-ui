import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as auth from "../../redux/slices/UserSlice";
import { actions } from "../../redux/slices/OrgSlice";

export default function Logout(){
    const dispatch = useDispatch();
    
    useEffect(() => {
        setTimeout(() => {
            dispatch(auth.actions.SET_LOGOUT());
            dispatch(actions.SET_LOGOUT());
        }, 2500);
    }, []);
    
    return(
        <h1>LOGGING OUT</h1>
    );
}