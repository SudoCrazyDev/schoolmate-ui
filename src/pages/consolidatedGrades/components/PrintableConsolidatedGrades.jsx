import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import PrintConsolidatedGrades from "./PrintConsolidatedGrades";

export default function PrintableConsolidatedGrades({section}){
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
    };

    return(
        <>
        <button className="btn btn-sm btn-primary" onClick={() => handleClickOpen()}>View</button>
        <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClickOpen()}>
            <DialogTitle className="m-0 fw-bolder">CONSOLIDATED GRADES</DialogTitle>
            <hr />
            <DialogContent style={{height: '100vh', overflow: 'scroll'}}>
                <PrintConsolidatedGrades section={section} open={open}/>
            </DialogContent>
        </Dialog>
        </>
    );
};