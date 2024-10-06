import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useAlert } from "../../hooks/CustomHooks";

export default function UnlockSection({subject}){
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert();
    
    const handleChangeGradeState = async (quarter, state) => {
        setSubmitting(true);
        await axios.put(`subjects/unlock_grades/${subject.id}`, {quarter: quarter, is_locked: state})
        .then(() => {
            alert.setAlert('success', `Quarter ${state ? 'Locked!' : 'Unlocked!'}`);
        })
        .catch(() => {
            alert.setAlert('error', `Quarter failed ${state ? 'Locked!' : 'Unlocked!'}`);
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    return(
        <>
        <p className="m-0 fw-bold mt-2 text-center">Unlock by Quarter</p>
        <div className="d-flex flex-row gap-2">
            <button className="btn btn-secondary" onClick={() => handleChangeGradeState('1', false)} disabled={submitting}>Q1</button>
            <button className="btn btn-secondary" onClick={() => handleChangeGradeState('2', false)} disabled={submitting}>Q2</button>
            <button className="btn btn-secondary" onClick={() => handleChangeGradeState('3', false)} disabled={submitting}>Q3</button>
            <button className="btn btn-secondary" onClick={() => handleChangeGradeState('4', false)} disabled={submitting}>Q4</button>
        </div>
        <p className="m-0 fw-bold mt-1 text-center">Lock by Quarter</p>
        <div className="d-flex flex-row gap-2">
            <button className="btn btn-primary" onClick={() => handleChangeGradeState('1', true)} disabled={submitting}>Q1</button>
            <button className="btn btn-primary" onClick={() => handleChangeGradeState('2', true)} disabled={submitting}>Q2</button>
            <button className="btn btn-primary" onClick={() => handleChangeGradeState('3', true)} disabled={submitting}>Q3</button>
            <button className="btn btn-primary" onClick={() => handleChangeGradeState('4', true)} disabled={submitting}>Q4</button>
        </div>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogContent className="d-flex flex-column">
                <h5 className="m-0 fw-bolder">Are you sure you want to unlock ?</h5>
            </DialogContent>
            <DialogActions>
                
            </DialogActions>
        </Dialog>
        </>
    );
};