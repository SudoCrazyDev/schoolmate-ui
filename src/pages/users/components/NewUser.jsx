import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { useAlert } from '../../../hooks/CustomHooks';
import {
    TextField,
    Button,
    Modal,
    ModalHeader,
    ModalContent,
    ModalActions,
    SelectComponent
} from "@UIComponents";

export default function NewUser({refreshUsers}){
    const [open, setOpen] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [roles, setRoles] = useState([]);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };

    const handleOpenModalState = () => {
        formik.resetForm();
        setOpen(true);
    };
    
    const handleSubmit = async(values) => {
        await axios.post('users/add', values)
        .then((res) => {
            alert.setAlert('success', 'New User Created');
            handleModalState();
            refreshUsers();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to Create User');
            formik.setSubmitting(false);
        })
    };

    const formik = useFormik({
        initialValues:{
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            birthdate: new Date().toLocaleDateString('en-CA'),
            gender: "male",
            institution_id: "",
            role_id: ""
        },
        onSubmit: handleSubmit
    });

    const handleFetchInstitutions = async () => {
        formik.setSubmitting(true);
        await axios.get('institution/all')
        .then((res) => {
            setInstitutions(res.data.data);
        })
        .finally(() => {
            formik.setSubmitting(false);
        })
    };
    
    const handleFetchRoles = async () => {
        formik.setSubmitting(true);
        await axios.get('roles/all')
        .then((res) => {
            setRoles(res.data.data);
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };

    useEffect(() => {
        if(open){
            handleFetchInstitutions();
            handleFetchRoles();
        }
    }, [open]);
    
    return(
        <>
        <Button type="button" onClick={() => handleOpenModalState()}>
            New User
        </Button>
        <Modal open={open}>
            <ModalHeader title="Create New User"/>
            <form onSubmit={formik.handleSubmit}>
                <ModalContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <TextField type="text" label="First Name" placeholder="John" value={formik.values.first_name} onChange={(e) => formik.setFieldValue("first_name", e.target.value)} />
                            <TextField type="text" label="Middle Name" placeholder="Martin" value={formik.values.middle_name} onChange={(e) => formik.setFieldValue("middle_name", e.target.value)} />
                        </div>
                        <TextField type="text" label="Last Name" placeholder="Doe" value={formik.values.last_name} onChange={(e) => formik.setFieldValue("last_name", e.target.value)} />
                        <div className="flex flex-row gap-2">
                            <TextField type="date" label="Birthdate" value={formik.values.birthdate} onChange={(e) => formik.setFieldValue("birthdate", e.target.value)} />
                            <div className="flex flex-col gap-2 w-full">
                                <p className="font-normal capitalize">Gender</p>
                                <SelectComponent className="text-md uppercase" defaultValue={"male"} onChange={(e) => formik.setFieldValue('gender', e.target.value)}>
                                    <option value="male" className="text-black text-md uppercase">
                                        Male
                                    </option>
                                    <option value="female" className="text-black text-md uppercase">
                                        Female
                                    </option>
                                </SelectComponent>
                            </div>
                        </div>
                        <TextField type="email" label="Email" placeholder="john.doe@gmail.com" value={formik.values.email} onChange={(e) => formik.setFieldValue("email", e.target.value)} />
                        <div className="flex flex-col gap-2 w-full">
                            <p className="font-normal capitalize">Institution</p>
                            <SelectComponent className="text-md uppercase" defaultValue={"male"} onChange={(e) => formik.setFieldValue('institution_id', e.target.value)}>
                                {institutions.map((institution => (
                                    <option key={institution.id} value={institution.id} className="text-black text-md uppercase">
                                        {institution.title}
                                    </option>
                                )))}
                            </SelectComponent>
                        </div>
                         <div className="flex flex-col gap-2 w-full">
                            <p className="font-normal capitalize">Role</p>
                            <SelectComponent className="text-md uppercase" defaultValue={"male"} onChange={(e) => formik.setFieldValue('role_id', e.target.value)}>
                                {roles.map((role => (
                                    <option key={role.id} value={role.id} className="text-black text-md uppercase">
                                        {role.title}
                                    </option>
                                )))}
                            </SelectComponent>
                        </div>
                    </div>
                </ModalContent>
                <ModalActions>
                    <Button type="submit" loading={formik.isSubmitting} disabled={formik.isSubmitting}>
                        Save
                    </Button>
                    <Button type="cancel" disabled={formik.isSubmitting}>
                        Cancel
                    </Button>
                </ModalActions>
            </form>
        </Modal>
        {/* <Dialog open={open} maxWidth="md" fullWidth>
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
                            onChange={(e, newValue) => formik.setFieldValue('institution_id', newValue.id)}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} label="Institution" />}
                        />
                        <Autocomplete
                            disablePortal
                            disabled={formik.isSubmitting}
                            id="combo-box-demo"
                            options={roles}
                            onChange={(e, newValue) => formik.setFieldValue('role_id', newValue.id)}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} label="Role" />}
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
        </Dialog> */}
        </>
    );
};