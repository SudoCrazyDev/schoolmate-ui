import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Axios from 'axios';
import { useFormik } from "formik";
import { useAlert } from '../../../hooks/CustomHooks';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';

export default function EditTeacher({teacher, refresh}){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      let isValid = await handleValidateEmail(values.email);
      if(!isValid) return;
      await Axios.put(`users/update/${teacher.id}`, values)
      .then(({data}) => {
        alert.setAlert('success', 'Teacher updated successfully');
        refresh();
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on creating teacher');
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };
    
    const handleValidateEmail = async (email) => {
      alert.setAlert('info', 'Validating Email');
      let isValid = false;
      if(email === teacher.email){
        return true;
      }
      await Axios.get(`users/validate/${email}`)
      .then((res) => {
        alert.setAlert('success', 'Email Valid!');
        isValid = true;
      })
      .catch((err) => {
        alert.setAlert('error', 'Email already exists!');
        isValid = false;
      });
      return isValid;
    };
    
    const formik = useFormik({
      initialValues:{
        first_name: teacher.first_name || '',
        middle_name: teacher.middle_name || '',
        last_name: teacher.last_name || '',
        email: teacher.email,
        roles: teacher.roles[0].id
      },
      enableReinitialize: true,
      onSubmit: handleSubmit
    });
    
    return(
        <>
        <Tooltip title="Update User Info">
          <IconButton className='ms-auto' onClick={() => setOpen(true)}>
              <EditIcon fontSize="small" color='primary'/>
          </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Update Teacher</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField inputProps={{
                          className: 'text-uppercase'
                        }} label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField inputProps={{
                          className: 'text-uppercase'
                        }} label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField 
                        inputProps={{
                          className: 'text-uppercase'
                        }}label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                            <Button type="button" variant="contained" color="error" onClick={() => handleCloseModal()} disabled={formik.isSubmitting}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}