import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { Document, PDFViewer, usePDF} from '@react-pdf/renderer';
import DTRFormPageComponent from "./DTRFormPageComponent";

export default function BulkPrintDTR({records}){
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }, []);
    
    return(
        <>
        <button className="btn btn-primary" onClick={handleModalState}>
            Bulk Print
        </button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bolder">
                BULK PRINTING OF DTR's
            </DialogTitle>
            <hr />
            <DialogContent style={{height: "80vh"}}>
                {isLoading && (
                    <h1 className="display-1">GENERATING....</h1>
                )}
                {!isLoading && (
                    <PDFViewer className='w-100' style={{height: "80vh"}}>
                        <Document>
                            {records.map(record => (
                                <DTRFormPageComponent teacher={record} attendances={record?.attendances}/>
                            ))}
                        </Document>
                    </PDFViewer>
                )}
            </DialogContent>
            <hr />
            <DialogActions>
                <button className="btn btn-danger" onClick={handleModalState}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};