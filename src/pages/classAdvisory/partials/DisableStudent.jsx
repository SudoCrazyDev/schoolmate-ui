import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useState } from "react";
import axios from 'axios';
import { useAlert } from "../../../hooks/CustomHooks";

export default function DisableStudent({student, refresh}){
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSubmit = async() => {
        setSubmitting(true)
        await axios.put(`students/disable/${student.id}`)
        .then(() => {
            alert.setAlert('success', 'Student Disabled!');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to disable student');
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    return(
        <>
        <Tooltip title="Disable Student">
            <IconButton color="error" size="small" onClick={() => handleModalState()}>
                <PersonOffIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bolder">Are you you want to disable the student?</DialogTitle>
            <DialogContent dividers>
                <div className="d-flex flex-column">
                    <h6 className="m-0 fw-bolder">Disabling the student will prohibit the teachers from adding grades, printing report card and editing info.</h6>
                </div>
            </DialogContent>
            <DialogActions className="d-flex flex-row gap-2 justify-content-start">
                <button className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit()}>
                    {submitting && <div className="spinner-border spinner-border-sm"></div>}
                    Submit
                </button>
                <button className="btn btn-danger" onClick={() => handleModalState()} disabled={submitting}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};