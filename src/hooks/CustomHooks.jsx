import { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "./ContextStore";

export const useAlert = () => {
    const {setAlertSettings} = useContext(AlertContext);
    return { setAlert: setAlertSettings };
};

export const useDebounce = (func, delay) => {
    const [debouncedFunction, setDebouncedFunction] = useState(func);

    const debouncedCallback = useCallback(func, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFunction(() => debouncedCallback);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    },[func, delay]);
    return debouncedFunction;
};