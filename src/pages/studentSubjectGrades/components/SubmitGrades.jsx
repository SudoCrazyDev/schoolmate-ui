import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useAlert } from "../../../hooks/CustomHooks";

export default function SubmitGrades({gradesToSubmit, refresh}){
    const [submitting, setSubmitting] = useState(false);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSubmitGrades = async () => {
        setSubmitting(true);
        await axios.post(`students/submit_grades`, {grades: gradesToSubmit})
        .then((res) => {
           alert.setAlert('success', 'Grades Submitted!');
           refresh();
           handleModalState();
        })
        .catch((err) => {
            alert.setAlert('error', 'Failed to submit grades');
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    return(
        <>
        <button className="btn btn-primary fw-bolder" onClick={() => handleModalState()} disabled={gradesToSubmit.length === 0}>SUBMIT</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bold">SUBMIT GRADES</DialogTitle>
            <DialogContent dividers>
                <div className="d-flex flex-column">
                    {/* <h5 className="m-0">Once submitted, you'll not be able to edit grades anymore. Please review carefully.</h5> */}
                    <div className="d-flex flex-row align-items-center mt-3">
                        <Checkbox checked={checked} className="m-0" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} onChange={(e) => setChecked(e.target.checked)} disabled={submitting}/>
                        <p className='m-0 fst-italic fw-bold' style={{fontSize: '18px'}}>I hereby affirm that all grades provided are accurate and have been verified for correctness.</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className="d-flex flex-row justify-content-start">
                <button className="btn btn-primary" onClick={() =>handleSubmitGrades()} disabled={submitting || !checked}>SUBMIT</button>
                <button className="btn btn-danger" onClick={() => handleModalState()} disabled={submitting}>CANCEL</button>
            </DialogActions>
        </Dialog>
        </>
    );
};