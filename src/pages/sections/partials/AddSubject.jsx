import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Axios from 'axios';
import { useFormik } from "formik";
import { useAlert } from '../../../hooks/CustomHooks';

export default function AddSubject({selectedSection, setSubjects}){
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const alert = useAlert()
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleFetchTeachers = () => {
      Axios.get('teachers')
      .then(({data}) => {
        setTeachers(data);
      });
    };
    
    const handleSubmit = (values) => {
      setLoading(true);
      Axios.post('section/subject/add', values)
      .then(({data}) => {
        console.log(data);
        setSubjects(data);
        alert.setAlert('success', 'Subject Added successfully');
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on adding subject');
      })
      .finally(() => {
        setLoading(false);
      });
    };
    
    const formik = useFormik({
      initialValues:{
        subject_title: '',
        section_id: selectedSection.id,
        user_id: '',
        start_time: "07:30",
        end_time: '19:30',
        schedule: 'daily'
      },
      onSubmit: handleSubmit
    });
    
    useEffect(() => {
      handleFetchTeachers()
    },[]);
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={() => setOpen(true)}>Add Subject</Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add New Subject for {selectedSection.section_name}</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('subject_title')} disabled={loading}/>
                        <Autocomplete
                            disabled={loading}
                            id="combo-box-demo"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('user_id', newValue.id);
                            }}
                            getOptionLabel={(option) => `${option.details?.first_name} ${option.details?.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        />
                        <TextField type="time" label="Start Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('start_time')} disabled={loading}/>
                        <TextField type="time" label="End Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('end_time')} disabled={loading}/>
                        <FormControl>
                            <InputLabel id="grade_level_label">Schedule</InputLabel>
                            <Select labelId="grade_level_label" label="Schedule" fullWidth defaultValue={'daily'} {...formik.getFieldProps('schedule')} disabled={loading}>
                                <MenuItem value={"daily"}>Daily</MenuItem>
                                <MenuItem value={"mwf"}>Monday, Wednesday, Friday</MenuItem>
                                <MenuItem value={"tth"}>Tuesday, Thursday</MenuItem>
                            </Select>
                        </FormControl>
                        <Divider />
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                            <Button variant="contained" color="error" onClick={() => handleCloseModal()} disabled={loading}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}