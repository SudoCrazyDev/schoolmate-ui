import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAlert } from '../../../hooks/CustomHooks';

export default function NewUser(){
    const [open, setOpen] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };

    const handleSubmit = (values) => {
        axios.post('user/add', values)
        .then(res => {
            alert.setAlert('success', 'Institution Admin Added!');
            setTimeout(() => {
                handleModalState();
            }, 1500);
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to Add Institution Admin!');
        });
    };

    const formik = useFormik({
        initialValues:{

        },
        onSubmit: handleSubmit
    });

    const handleFetchInstitutions = () => {
        axios.get(`institution/all`)
        .then(({data}) => {
            setInstitutions(data.data);
        })
    };

    useEffect(() => {
        handleFetchInstitutions();
    },[]);
    return(
        <>
        <button className="btn btn-primary fw-bolder" onClick={handleModalState}>New User</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className='fw-bolder'>Create New User</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-row gap-2">
                            <input type="text" className="form-control" placeholder='First Name' {...formik.getFieldProps('first_name')}/>
                            <input type="text" className="form-control" placeholder='Middle Name' {...formik.getFieldProps('middle_name')}/>
                            <input type="text" className="form-control" placeholder='Last Name' {...formik.getFieldProps('last_name')}/>
                        </div>
                        <div className="d-flex flex-row gap-2">
                            <input type="date" className="form-control" placeholder='Birthdate' {...formik.getFieldProps('birthdate')}/>
                            <select className='form-select' onChange={(e) => formik.setFieldValue('gender', e.target.value)}>
                                <option value={`male`}>Male</option>
                                <option value={`female`}>Female</option>
                            </select>
                        </div>
                        <input type="email" className="form-control" placeholder='Email' {...formik.getFieldProps('email')}/>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={institutions}
                            onChange={(e, newValue) => formik.setFieldValue('institution', newValue.id)}
                            getOptionLabel={(option) => option.institution}
                            renderInput={(params) => <TextField {...params} label="Institution" />}
                        />
                    </div>
                </DialogContent>
                <DialogActions className='d-flex justify-content-start p-2'>
                    <button type='submit' className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-danger" onClick={handleModalState}>Cancel</button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};