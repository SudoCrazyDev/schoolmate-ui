import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import Axios from "axios";
import { useSelector } from 'react-redux';
import { useAlert } from '../../../hooks/CustomHooks';

export default function EditSubject({subject, setSubjects}){
    const [open, setOpenModal] = useState(false);
    const { teachers } = useSelector(state => state.org);
    const alert = useAlert();
    
    const {
        subject_title,
        schedule,
        start_time,
        end_time,
        user_id,
        id
    } = subject;
    
    const handleModalState = () => {
        setOpenModal(!open);
    };
    
    const handleSubmit = (values) => {
        formik.setSubmitting(true)
        Axios.put(`section/subject/update/${id}`, values)
        .then(({data}) => {
            setSubjects(data);
            alert.setAlert('success', 'Subject updated successfully');
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Subject updated failed');
        })
        .finally(() => {
            formik.setSubmitting(false)
        });
    };
    
    const formik = useFormik({
        initialValues: {
            subject_title: subject_title,
            user_id: user_id,
            start_time: start_time,
            end_time: end_time,
            schedule: schedule
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <IconButton size='small' color='primary' onClick={() => handleModalState()}>
            <EditIcon />
        </IconButton>
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className='fw-bolder'>Update Subject Details</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('subject_title')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            disabled={formik.isSubmitting}
                            id="combo-box-demo"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('user_id', newValue.id);
                            }}
                            defaultValue={teachers[teachers.map(teacher => teacher.id).indexOf(user_id)]}
                            getOptionLabel={(option) => `${option.details?.first_name} ${option.details?.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        />
                        <TextField type="time" label="Start Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('start_time')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="End Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('end_time')} disabled={formik.isSubmitting}/>
                        <FormControl>
                            <InputLabel id="grade_level_label">Schedule</InputLabel>
                            <Select labelId="grade_level_label" label="Schedule" fullWidth defaultValue={'daily'} {...formik.getFieldProps('schedule')} disabled={formik.isSubmitting}>
                                <MenuItem value={"daily"}>Daily</MenuItem>
                                <MenuItem value={"mwf"}>Monday, Wednesday, Friday</MenuItem>
                                <MenuItem value={"tth"}>Tuesday, Thursday</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions className='d-flex flex-row justify-content-start mt-2'>
                    <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                    <Button variant="contained" color="error" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
}