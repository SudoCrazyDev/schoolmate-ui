import WorkIcon from '@mui/icons-material/Work';
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useAlert } from '../../../hooks/CustomHooks';
import { useState } from 'react';

export default function UpdateTeacherEmployment({teacher, refresh}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
        formik.resetForm();
    };
    
    const handleSubmit = async () => {
        await axios.put(`users/employment/${teacher.id}`, formik.values)
        .then(() => {
            refresh();
            alert.setAlert('success', 'Employment Details Updated');
            setTimeout(() => {
                handleModalState();
            }, 2500);
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update Employment Details');
        });
    };
    
    const formik = useFormik({
        initialValues:{
            employee_id: teacher?.employment?.employee_id || "",
            date_started: teacher?.employment?.date_started || new Date().toLocaleDateString("en-CA"),
            position: teacher?.employment?.position || "",
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Tooltip title="Update Employment">
            <IconButton color='primary' onClick={() => handleModalState()}>
                <WorkIcon fontSize="small" color='primary'/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} onClose={handleModalState} fullWidth maxWidth="md">
            <DialogTitle>
                Update Staff Employment Details
            </DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
                    <TextField inputProps={{
                        className: 'text-uppercase'
                    }} label="Employee ID" variant="outlined" {...formik.getFieldProps('employee_id')} disabled={formik.isSubmitting}/>
                    <TextField inputProps={{
                        className: 'text-uppercase'
                    }} type='date' label="Date Started" variant="outlined" {...formik.getFieldProps('date_started')} disabled={formik.isSubmitting}/>
                    <TextField
                    inputProps={{
                        className: 'text-uppercase'
                    }}label="Position" variant="outlined" {...formik.getFieldProps('position')} disabled={formik.isSubmitting}/>
                    <div className="d-flex flex-row mt-2 gap-2">
                        <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                        <Button type="button" variant="contained" color="error" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Cancel</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}