import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useContext } from 'react';
import { AlertContext } from '../hooks/ContextStore';

const AlertComponent = () => {
    const {alertSettings, closeAlert} = useContext(AlertContext);
    return (
        <Snackbar open={alertSettings.open} autoHideDuration={3000} onClose={closeAlert} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
           <Alert severity={alertSettings.severity} variant="outlined">{alertSettings.message}</Alert>
        </Snackbar>
    );
};

export default function GlobalComponents(){
    return(
        <>
            <AlertComponent />
        </>
    );
}