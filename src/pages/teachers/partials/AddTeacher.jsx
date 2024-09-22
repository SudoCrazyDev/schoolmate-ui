import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useFormik } from "formik";
import { useAlert, useIsAllowedTo } from '../../../hooks/CustomHooks';
import { GetActiveInstitution } from '../../../global/Helpers';
import pb from '../../../global/pb';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function AddTeacher({refreshTeachers}){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    const [roles, setRoles] = useState([]);
    const {institutions} = useSelector(state => state.user);
    
    const handleModalState = () => {
      formik.resetForm();
      setOpen(!open);
    };

    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleFetchRoles = async () => {
      await axios.get('roles/all')
      .then((res) => {
        setRoles(res.data.data || []);
      })
    };

    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      await axios.post('users/add', values)
      .then((res) => {
        refreshTeachers();
        handleModalState();
        alert.setAlert('success', 'Staff Created!');
      })
      .catch((err) => {
        alert.setAlert('error', 'Failed to create staff!');
      });
    };

    const formik = useFormik({
      initialValues:{
        first_name: '',
        middle_name: '',
        last_name: '',
        ext_name: "",
        email: "",
        gender: "",
        birthdate: "",
        role_id: "",
        institution_id: institutions[0].id
      },
      onSubmit: handleSubmit
    });
    
    useEffect(() => {
      if(open){
        handleFetchRoles();
      }
    }, [open]);

    return(
        <>
        <button className="btn btn-primary fw-bold" onClick={() => handleModalState()}>NEW STAFF</button>
        {/* <Button variant="contained" className='fw-bolder' onClick={() => handleModalState()} disabled={!isAllowed}>
          {isLoading ? <div className='spinner-border spinner-border-sm'></div> : "ADD STAFF"}
        </Button> */}
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>CREATE STAFF</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField id="first_name" label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField id="middle_name" label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField id="last_name" label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField id="email" label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
                        <label className='fw-bold m-0'>Staff Role</label>
                        <select className='form-select' value={formik.values.roles} onChange={(e) => formik.setFieldValue('role_id', e.target.value)}>
                          {roles.map((role, index) => (
                              <option id={index} value={role.id}>
                                {role.title}
                              </option>
                          ))}
                        </select>
                        <Divider />
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                            <Button variant="contained" color="error" onClick={() => handleCloseModal()} disabled={formik.isSubmitting}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}