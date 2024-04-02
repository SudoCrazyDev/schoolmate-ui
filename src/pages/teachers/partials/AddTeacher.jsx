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

export default function AddTeacher(){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    const dispatch = useDispatch();
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleSubmit = (values) => {
      formik.setSubmitting(true);
      Axios.post('teacher/add', values)
      .then(({data}) => {
        alert.setAlert('success', 'Teacher Added successfully');
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
        first_name: '',
        middle_name: '',
        last_name: '',
        email: ""
      },
      onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={() => setOpen(true)}>Add Teacher</Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add Teacher</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField id="first_name" label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField id="middle_name" label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField id="last_name" label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField id="email" label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
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