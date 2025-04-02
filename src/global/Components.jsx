import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useContext, useEffect, useRef, useState } from 'react';
import { AlertContext } from '../hooks/ContextStore';
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

const AlertComponent = () => {
    const {alertSettings, closeAlert} = useContext(AlertContext);
    return (
        <Snackbar open={alertSettings.open} autoHideDuration={3000} onClose={closeAlert} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
           <Alert severity={alertSettings.severity} variant="filled">{alertSettings.message}</Alert>
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

export const QRCodeCanvas = ({value, setUrl}) => {
    const canvasRef = useRef(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        if (canvasRef.current) {
          toPng(canvasRef.current)
            .then(setQrCodeUrl)
            .catch(console.error);
        }
      }, [value]);
      
    useEffect(() => {
        setUrl(qrCodeUrl, "set_qr_code_url");
    }, [qrCodeUrl]);

    return (
        <div ref={canvasRef} className='qr-code-wrapper'>
            <QRCode value={value} size={150} />
        </div>
    );
};