import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useState } from 'react';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';

export default function AddInstitution({setInstitutions}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        await Axios.post('institution/add', values)
        .then((res) => {
            setInstitutions(res.data.data.data);
            alert.setAlert('success', res.data.message);
            handleModalState();
        })
        .catch(err => {
            alert.setAlert('error', err.response.data.message);
            formik.setSubmitting(false);
        });
    };
    
    const formik = useFormik({
        initialValues: {
            title: '',
            abbr: '',
            division: '',
            region: '',
            address: '',
            gov_id: ''
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button className='fw-bolder' variant='contained' onClick={() => handleModalState()}>NEW</Button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className='fw-bolder'>NEW INSTITUTION</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <TextField variant='outlined' label="Insitution" {...formik.getFieldProps('title')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Abbrevation (Eg. ILSNHMD, GSCNSSAT)" {...formik.getFieldProps('abbr')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Address" {...formik.getFieldProps('address')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="School ID" {...formik.getFieldProps('gov_id')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Region" {...formik.getFieldProps('region')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Division" {...formik.getFieldProps('division')} disabled={formik.isSubmitting}/>
                        {/* <TextField variant='outlined' label="School ID" {...formik.getFieldProps('gov_id')} disabled={formik.isSubmitting}/> */}
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