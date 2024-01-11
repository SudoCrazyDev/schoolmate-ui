import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik';

export default function RequestForChange({student, selectedSubject}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
        formik.resetForm();
    };
    
    const handleSubmitRequest = (values) => {
        formik.setSubmitting(true);
        Axios.post('request/add', values)
        .then(({data}) => {
            console.log(data);
            alert.setAlert('success', 'Request submitted successfully')
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Error sending your request')
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const formik = useFormik({
        initialValues:{
            student_id: student.student.id,
            subject_id: selectedSubject.id,
            grading_period: '1',
            value: 0,
            description: '',
        },
        onSubmit: handleSubmitRequest
    });
    
    return(
        <>
        <IconButton color='primary' onClick={() => handleModalState()}>
            <EditIcon color='primary' fontSize='small' />
        </IconButton>
        <Dialog scroll='paper' open={open} maxWidth="md" fullWidth>
            <DialogTitle>Request for change of Grade</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                <div className="d-flex flex-row flex-wrap">
                    <FormControl className='col-12'>
                        <InputLabel id="grade_level_label">Grading Period</InputLabel>
                        <Select labelId="grade_level_label" label="Grading Period" fullWidth {...formik.getFieldProps('grading_period')} disabled={formik.isSubmitting}>
                            <MenuItem value={'1'}>1st</MenuItem>
                            <MenuItem value={'2'}>2nd</MenuItem>
                            <MenuItem value={'3'}>3rd</MenuItem>
                            <MenuItem value={'4'}>4th</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField type="number" className="col-12 p-1 my-1" label="New Grade" variant="outlined" {...formik.getFieldProps('value')} disabled={formik.isSubmitting}/>
                    <TextField type="number" className="col-12 p-1 my-1" label="Reason for change" variant="outlined" multiline rows={4} {...formik.getFieldProps('description')} disabled={formik.isSubmitting}/>
                </div>
                </DialogContent>
                <DialogActions className='p-3 justify-content-start'>
                    <Button type="submit" size='small' variant="contained" color="primary" disabled={formik.isSubmitting}>Submit</Button>
                    <Button size='small' variant="contained" color="error" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
}