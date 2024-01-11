import { useSelector } from "react-redux";
import Axios from "axios";
import { useEffect } from "react";

export default function AuthInit({children}){
const {token} = useSelector(state => state.user)

const tokenCheck = () => {
    if(token !== null){
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
};

useEffect(() =>{
    tokenCheck()
},[token]);

return(
    <>
    {children}
    </>
);
}