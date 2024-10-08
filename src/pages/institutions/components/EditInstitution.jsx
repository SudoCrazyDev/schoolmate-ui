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
import { IconButton, Tooltip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function EditInstitution({institution, refresh}){
    const [open, setOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        const formData = new FormData();
        for(const [key, value] of Object.entries(values)){
            formData.append(key, value);
        }
        await axios.post(`institution/update`, formData)
        .then(({data}) => {
            alert.setAlert('success', 'Institution Updated');
            handleModalState();
            refresh();
        })
        .catch((err) => {
            console.log(err);
            alert.setAlert('error', 'Failed to update Institution');
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const handleUploadFile = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedFile(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        formik.setFieldValue('logo', e.target.files[0]);
    };
    
    const formik = useFormik({
        initialValues: {
            id: institution.id,
            institution: institution.title,
            abbr: institution.abbr,
            gov_id: institution.gov_id,
            address: institution.address,
            logo: institution.logo
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleModalState()}>
                <CreateIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className='fw-bolder'>UPDATE INSTITUTION</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <TextField variant='outlined' label="Institution" value={formik.values.institution} {...formik.getFieldProps('institution')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Abbrevation (Eg. ILSNHMD, GSCNSSAT)" {...formik.getFieldProps('abbr')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="School ID" {...formik.getFieldProps('gov_id')} disabled={formik.isSubmitting}/>
                        <TextField variant='outlined' label="Address" {...formik.getFieldProps('address')} disabled={formik.isSubmitting}/>
                        <div className="col-4 d-flex flex-column gap-2">
                            {!uploadedFile && formik.values.logo && (
                                <img src={formik.values.logo} className='border rounded shadow'/>
                            )}
                            {uploadedFile && formik.values.logo && (
                                <img src={uploadedFile} className='border rounded shadow'/>
                            )}
                            <input type="file" className="form-control" onChange={(e) => handleUploadFile(e)}/>
                        </div>
                        
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