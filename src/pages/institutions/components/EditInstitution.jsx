import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';

export default function EditInstitution(){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = (values) => {
        formik.setSubmitting(true);
        axios.post('institution/create', values)
        .then(({data}) => {
            alert.setAlert('success', 'Institution Updated');
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update Institution');
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const formik = useFormik({
        initialValues: {
            institution: '',
            abbr: '',
            gov_id: ''
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button className='fw-bolder' variant='contained' onClick={() => handleModalState()}>Create</Button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className='fw-bolder'>NEW INSTITUTION</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <TextField variant='outlined' label="Insitution" {...formik.getFieldProps('institution')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Abbrevation (Eg. ILSNHMD, GSCNSSAT)" {...formik.getFieldProps('abbr')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="School ID" {...formik.getFieldProps('gov_id')} disabled={formik.isSubmitting}/>
                    </div>
                </DialogContent>
                <DialogActions className='d-flex flex-row justify-content-start'>
                    <Button type="submit" variant='contained' disabled={formik.isSubmitting}>
                        {formik.isSubmitting ?
                            <div className="spinner-border spinner-border-sm"></div>
                        :
                            "Submit"
                        }
                    </Button>
                    <Button variant='contained' color="error" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};