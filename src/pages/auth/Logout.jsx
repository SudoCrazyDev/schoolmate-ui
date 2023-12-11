import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as auth from "../../redux/slices/UserSlice";

export default function Logout(){
    const dispatch = useDispatch();
    
    useEffect(() => {
        setTimeout(() => {
            dispatch(auth.actions.SET_TOKEN(null));
        }, 2500);
    }, []);
    
    return(
        <h1>LOGGING OUT</h1>
    );
}