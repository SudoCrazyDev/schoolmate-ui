import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Axios from 'axios';
import { useFormik } from "formik";
import { useAlert, useIsAllowedTo } from '../../../hooks/CustomHooks';
import { useDispatch } from 'react-redux';
import { actions } from '../../../redux/slices/OrgSlice';
import { GetActiveInstitution, GetAppInstitutionRoles } from '../../../global/Helpers';
import pb from '../../../global/pb';

export default function AddTeacher({refreshTeachers}){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    const { isAllowed, isLoading } = useIsAllowedTo('create-subject-teacher');
    const { id } = GetActiveInstitution();
    const [roles, setRoles] = useState([]);
    
    const handleModalState = () => {
      if(!isAllowed){
        return ;
      }
      formik.resetForm();
      setOpen(!open);
    };

    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleFetchRoles = async () => {
      const roles = await GetAppInstitutionRoles();
      setRoles(roles);
    };

    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      try {
        const record_auth = await pb.collection('users')
        .create({
            username: crypto.randomUUID(),
            email: values.email,
            emailVisibility: true,
            password: 'password',
            passwordConfirm: 'password'
        });
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const record_personal_data = await pb.collection("user_personal_data")
        .create({
            user_id: record_auth.id,
            first_name: values.first_name,
            middle_name: values.middle_name,
            last_name: values.last_name,
        });
        await new Promise((resolve) => setTimeout(resolve, 2500));
        await pb.collection('user_relationships')
        .create({
            user: record_auth.id,
            institutions: [id],
            personal_info: record_personal_data.id,
            roles: values.roles
        });
        alert.setAlert('success', 'Teacher Added successfully');
        refreshTeachers();
      } catch (error) {
        alert.setAlert('error', 'Error on creating teacher');
      } finally {
        formik.setSubmitting(false);
        handleCloseModal();
      }
      
    };

    const formik = useFormik({
      initialValues:{
        first_name: '',
        middle_name: '',
        last_name: '',
        email: "",
        roles: "tv6buv1rj90q81f"
      },
      onSubmit: handleSubmit
    });
    
    useEffect(() => {
      handleFetchRoles();
    }, []);

    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={() => handleModalState()} disabled={!isAllowed}>
          {isLoading ? <div className='spinner-border spinner-border-sm'></div> : "ADD STAFF"}
        </Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>ADD STAFF</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField id="first_name" label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField id="middle_name" label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField id="last_name" label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField id="email" label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
                        <select className='form-select' value={formik.values.roles} onChange={(e) => formik.setFieldValue('roles', e.target.value)}>
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