import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import Axios from "axios";
import { useSelector } from 'react-redux';
import { useAlert } from '../../../hooks/CustomHooks';

export default function DeleteSubject({subject, refresh}){
    const [open, setOpenModal] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpenModal(!open);
    };
    
    const handleSubmit = () => {
        formik.setSubmitting(true);
        Axios.delete(`subjects/${subject.id}`)
        .then(({data}) => {
            refresh();
            alert.setAlert('success', 'Subject deleted successfully')
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Subject failed to delete')
        })
        .finally(() => {
            formik.setSubmitting(false);
        })
    };
    
    const formik = useFormik({
        initialValues: {
            id: subject.id
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <IconButton size='small' color='error' onClick={() => handleModalState()}>
            <DeleteIcon fontSize="small"/>
        </IconButton>
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className='fw-bolder'>Delete Subject</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <p className="m-0 fw-light">
                        Are you really sure you want to <span className='fst-italic fw-bolder'>delete</span> this subject? This will also delete all student grade inputs.
                    </p>
                </DialogContent>
                <DialogActions className='d-flex flex-row justify-content-start mt-2'>
                    <Button type="submit" size="small" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                    <Button size="small" variant="contained" color="error" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    )
}