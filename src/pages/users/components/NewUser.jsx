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
import pb from '../../../global/pb';

export default function NewUser({refreshUsers}){
    const [open, setOpen] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };

    const handleOpenModalState = () => {
        handleFetchInstitutions();
        formik.resetForm();
        setOpen(true);
    };
    const handleSubmit = async(values) => {
        try {
            const record_auth = await pb.collection('users')
            .create({
                username: crypto.randomUUID(),
                email: values.email,
                emailVisibility: true,
                password: 'password',
                passwordConfirm: 'password'
            })
            await new Promise((resolve) => setTimeout(resolve, 2500));
            const record_personal_data = await pb.collection("user_personal_data")
            .create({
                user: record_auth.id,
                first_name: values.first_name,
                middle_name: values.middle_name,
                last_name: values.last_name,
                gender: values.gender,
                birthdate: values.birthdate
            });
            await new Promise((resolve) => setTimeout(resolve, 2500));
            await pb.collection('user_relationships')
            .create({
                user_id: record_auth.id,
                institutions: [values.institution],
                personal_info: record_personal_data.id
            });
            alert.setAlert('success', 'New User Added');
            refreshUsers();
            handleModalState();
        } catch (error) {
            alert.setAlert('error', 'Failed to add user');
        }
    };

    const formik = useFormik({
        initialValues:{
            first_name: "",
            middle_name: "",
            last_name: "",
            birthdate: new Date().toLocaleDateString('en-CA'),
            gender: "male"
        },
        onSubmit: handleSubmit
    });

    const handleFetchInstitutions = async () => {
        formik.setSubmitting(true);
        try {
            const records = await pb.collection("institutions").getFullList();
            setInstitutions(records);
        } catch (error) {
            alert.setAlert('error', 'Failed to fetch Institutions');
        }finally{
            formik.setSubmitting(false);
        }
    };

    return(
        <>
        <button className="btn btn-primary fw-bolder" onClick={() => handleOpenModalState()}>New User</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className='fw-bolder'>Create New User</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-row gap-2">
                            <input type="text" className="form-control text-uppercase" placeholder='First Name' {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                            <input type="text" className="form-control text-uppercase" placeholder='Middle Name' {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                            <input type="text" className="form-control text-uppercase" placeholder='Last Name' {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        </div>
                        <div className="d-flex flex-row gap-2">
                            <input type="date" className="form-control" placeholder='Birthdate' {...formik.getFieldProps('birthdate')} disabled={formik.isSubmitting}/>
                            <select className='form-select' onChange={(e) => formik.setFieldValue('gender', e.target.value)} disabled={formik.isSubmitting}>
                                <option value={`male`}>Male</option>
                                <option value={`female`}>Female</option>
                            </select>
                        </div>
                        <input type="email" className="form-control" placeholder='Email' {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            disablePortal
                            disabled={formik.isSubmitting}
                            id="combo-box-demo"
                            options={institutions}
                            onChange={(e, newValue) => formik.setFieldValue('institution', newValue.id)}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} label="Institution" />}
                        />
                    </div>
                </DialogContent>
                <DialogActions className='d-flex justify-content-start p-2'>
                    <button type='submit' className="btn btn-primary" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? <div className='spinner-border spinner-border-sm'></div> : "Save"}
                    </button>
                    <button type="button" className="btn btn-danger" disabled={formik.isSubmitting} onClick={handleModalState}>Cancel</button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};