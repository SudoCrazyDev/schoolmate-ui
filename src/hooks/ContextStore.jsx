import { createContext, useState } from "react";

export const AlertContext = createContext(null);
export default function ContextStore({children}){
    const [alertSettings, setAlertSettings] = useState({open: false, severity: 'success', message: '🔥NO MESSAGE - CHECK IT OUT!🔥'});
    
    const setAlert = (severity, message) => {
        setAlertSettings({
            open: true,
            severity: severity || 'success',
            message: message || '🔥NO MESSAGE - CHECK IT OUT!🔥',
        });
    };
    
    const closeAlert = () => {
        setAlertSettings({
            ...alertSettings,
            open: false,
        });
    };
    
    return(
      <AlertContext.Provider value={{alertSettings, setAlertSettings: setAlert, closeAlert}}>
        {children}
      </AlertContext.Provider>
    );
}