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
import { useDispatch } from 'react-redux';
import { actions } from '../../../redux/slices/OrgSlice';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function EditTeacher({teacher}){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    const dispatch = useDispatch();
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleSubmit = (values) => {
      formik.setSubmitting(true);
      Axios.put(`teacher/update/${teacher.id}`, values)
      .then(({data}) => {
        alert.setAlert('success', 'Teacher updated successfully');
        dispatch(actions.SET_TEACHERS(data));
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on creating teacher');
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };
    
    const formik = useFormik({
      initialValues:{
        first_name: teacher.details.first_name || '',
        middle_name: teacher.details.middle_name || '',
        last_name: teacher.details.last_name || '',
        email: teacher.email
      },
      onSubmit: handleSubmit
    });
    
    return(
        <>
        <IconButton className='ms-auto' onClick={() => setOpen(true)}>
            <EditIcon fontSize="small" color='primary'/>
        </IconButton>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Update Teacher</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
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