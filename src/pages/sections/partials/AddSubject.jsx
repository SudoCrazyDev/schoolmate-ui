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
import { useSelector } from 'react-redux';
import pb from '../../../global/pb';
import { GetActiveInstitution } from '../../../global/Helpers';

export default function AddSubject({selectedSection, refresh}){
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const { institutions } = useSelector(state => state.user);
    const alert = useAlert()
    const [fetching, setFetching] = useState(false);
    const [scheduleConflict, setScheduleConflict] = useState(false);
    const [conflictSchedules, setConflictSchedules] = useState([]);
    
    const handleFetchTeachers = async () => {
      setFetching(true);
        await Axios.get(`users/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            let fetched = res.data.data.data;
            setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        })
        .catch(() => {
            alert.setAlert("error", 'Failed to fetch Teachers');
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };

    const handleFetchScheduleConflict = async (user_id) => {
      setFetching(true);
      await Axios.post(`subjects/validate_conflict`, {
          subject_teacher: user_id,
          start_time: formik.values.start_time
      })
      .then((res) => {
          if(res.data.length > 0){
              setScheduleConflict(true);
              setConflictSchedules(res.data);
          }else{
              setScheduleConflict(false);
              setConflictSchedules([]);
          }
      })
      .finally(() => {
          setFetching(false);
      });
  };
  
    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      await Axios.post('subjects/add', values)
      .then(({data}) => {
        refresh();
        alert.setAlert('success', 'Subject Created!');
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on adding subject');
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };
    
    const formik = useFormik({
      initialValues:{
        title: '',
        section_id: selectedSection.id,
        subject_teacher: null,
        start_time: '',
        end_time: ''
      },
      enableReinitialize: true,
      onSubmit: handleSubmit
    });
    
    useEffect(() => {
      if(open){
        handleFetchTeachers();
      }
    }, [open]);
    return(
        <>
        <button className="btn btn-primary fw-bold" onClick={() => setOpen(true)}>Add Subject</button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add New Subject for {selectedSection.section_name}</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('title')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="Start Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('start_time')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="End Time" variant="outlined" value={"07:30"} {...formik.getFieldProps('end_time')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disabled={fetching}
                            disableClearable
                            getOptionDisabled={(option) => option.id === "sample"}
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('subject_teacher', newValue.id);
                              handleFetchScheduleConflict(newValue.id);
                            }}
                            getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" error={scheduleConflict}/>}
                        />
                        {scheduleConflict && (
                            <>
                                <p className='m-0 text-danger'>Conflict Schedules:</p>
                                {conflictSchedules.map((schedule, index) => (
                                    <p className="m-0 ms-3 text-danger">{`${schedule.section?.grade_level}-${schedule.section?.title}: ${schedule.title}`}</p>
                                ))}
                            </>
                        )}
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