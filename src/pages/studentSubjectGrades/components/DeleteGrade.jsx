import { Dialog, DialogActions, DialogTitle, Tooltip } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "../../../hooks/CustomHooks";

export default function DeleteGrade({grade, refresh, student}){
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    useEffect(() => {
        if(open){
            console.log(grade);
        }
    }, [open]);
    
    const handleDeleteGrade = async () => {
        setSubmitting(true);
        await axios.delete(`students/grade/${grade.id}`)
        .then(() => {
            alert.setAlert('success', 'Grade Deleted');
            refresh();
            handleModalState();
        }).catch(() => {
            alert.setAlert('error', 'Failed to delete Grade');
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    return(
        <>
        <button className="btn btn-outline-danger" onClick={() => handleModalState()} style={{ zIndex: 0 }}>
            <Tooltip title="Delete Grade">
                <DeleteForeverIcon />
            </Tooltip>
        </button>
        {/* <Tooltip title="Delete Grade">
            <IconButton color="error" size="small" onClick={() => handleModalState()}>
                <DeleteForeverIcon />
            </IconButton>
        </Tooltip> */}
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bold">Do you want to delete this student grade? You can't undo this action.</DialogTitle>
            <hr />
            <DialogActions className="justify-content-start gap-2">
                <button className="btn btn-primary" onClick={() => handleDeleteGrade()} disabled={submitting}>
                    {submitting && <span className="spinner-border spinner-border-sm"></span>}
                    Submit
                </button>
                <button className="btn btn-danger" onClick={() => handleModalState()} disabled={submitting}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};