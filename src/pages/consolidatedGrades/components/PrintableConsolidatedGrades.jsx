import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import PrintConsolidatedGrades from "./PrintConsolidatedGrades";

export default function PrintableConsolidatedGrades({section, quarter}){
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
    };
    
    const handleGetQuarterTitle = () => {
        switch(quarter){
            case 1: return "1st";
            case 2: return "2nd";
            case 3: return "3rd";
            case 4: return "4th";
            default: return quarter;
        }
    };

    return(
        <>
        <button className="btn btn-sm btn-primary" onClick={() => handleClickOpen()}>{handleGetQuarterTitle()}</button>
        <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClickOpen()}>
            <DialogTitle className="m-0 fw-bolder">CONSOLIDATED GRADES</DialogTitle>
            <hr />
            <DialogContent style={{height: '100vh', overflow: 'scroll'}}>
                <PrintConsolidatedGrades section={section} open={open} quarter={quarter}/>
            </DialogContent>
        </Dialog>
        </>
    );
};