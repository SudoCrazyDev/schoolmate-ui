
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useAlert } from '../../../hooks/CustomHooks';

export default function SubmitCoreValues({coreValues, refresh}){
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSubmit = async () => {
        setSubmitting(true);
        alert.setAlert('info', 'Submitting Core Values!');
        await axios.post(`students/submit_core_values`, {corevalues: coreValues})
        .then(() => {
            alert.setAlert('success', 'Core Values Submitted!');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to Submit Core Values!');
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    return(
        <>
        <button className="btn btn-primary" disabled={coreValues.length === 0} onClick={() => handleModalState()}>Submit</button>
        <Dialog open={open} fullWidth maxWidth="md">
            <DialogTitle className='fw-bold'>Submit Core Values</DialogTitle>
            <DialogContent dividers>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row align-items-center mt-3">
                        <p className='m-0 fst-italic fw-bold' style={{fontSize: '18px'}}>I hereby affirm that all core values provided are accurate and have been verified for correctness.</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className='d-flex flex-row justify-content-start gap-1'>
                <button className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit()}>
                    {submitting && <div className='spinner-border spinner-border-sm'></div>}
                    Submit
                </button>
                <button className="btn btn-danger" disabled={submitting} onClick={() => handleModalState()}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};