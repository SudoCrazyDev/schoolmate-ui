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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function AddCurriculumHead(){
    const [open, setOpen] = useState(false);
    const alert = useAlert()
    const dispatch = useDispatch();
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleSubmit = (values) => {
      formik.setSubmitting(true);
      Axios.post('curricuum-head/add', values)
      .then(({data}) => {
        alert.setAlert('success', 'Curriculum Head Added successfully');
        dispatch(actions.SET_CURRICULUM_HEADS(data));
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on creating curriculum head');
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
        email: "",
        role: "",
      },
      onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={() => setOpen(true)}>Add Curriculum Head</Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add Curriculum Head</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField id="first_name" label="First Name" variant="outlined" {...formik.getFieldProps('first_name')} disabled={formik.isSubmitting}/>
                        <TextField id="middle_name" label="Middle Name" variant="outlined" {...formik.getFieldProps('middle_name')} disabled={formik.isSubmitting}/>
                        <TextField id="last_name" label="Last Name" variant="outlined" {...formik.getFieldProps('last_name')} disabled={formik.isSubmitting}/>
                        <TextField id="email" label="Email" variant="outlined" {...formik.getFieldProps('email')} disabled={formik.isSubmitting}/>
                        <FormControl>
                        <InputLabel id="grade_level_label">Assigned Grade Level</InputLabel>
                        <Select id="grade_level" labelId="grade_level_label" label="Assigned Grade Level" fullWidth {...formik.getFieldProps('role')} disabled={formik.isSubmitting}>
                            <MenuItem value={"curriculum-head-7"}>Grade 7</MenuItem>
                            <MenuItem value={"curriculum-head-8"}>Grade 8</MenuItem>
                            <MenuItem value={"curriculum-head-9"}>Grade 9</MenuItem>
                            <MenuItem value={"curriculum-head-10"}>Grade 10</MenuItem>
                            <MenuItem value={"curriculum-head-11"}>Grade 11</MenuItem>
                            <MenuItem value={"curriculum-head-12"}>Grade 12</MenuItem>
                        </Select>
                        </FormControl>
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