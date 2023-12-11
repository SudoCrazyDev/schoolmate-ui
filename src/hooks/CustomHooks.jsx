import { useContext } from "react";
import { AlertContext } from "./ContextStore";

export const useAlert = () => {
    const {setAlertSettings} = useContext(AlertContext);
    return { setAlert: setAlertSettings };
};