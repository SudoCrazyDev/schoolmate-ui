import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
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
import pb from '../../../global/pb';
import { GetActiveInstitution } from '../../../global/Helpers';
import axios from 'axios';

export default function EditSubject({subject, refresh}){
    const [open, setOpenModal] = useState(false);
    const alert = useAlert();
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const { institutions } = useSelector(state => state.user);
    const [scheduleConflict, setScheduleConflict] = useState(false);
    const [conflictSchedules, setConflictSchedules] = useState([]);

    const {
        id,
        title,
        start_time,
        end_time,
        schedule,
        subject_teacher,
        section_id
    } = subject;

    const handleModalState = () => {
        setOpenModal(!open);
    };

    const handleFetchScheduleConflict = async (user_id) => {
        setFetching(true);
        await axios.post(`subjects/validate_conflict`, {
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
        formik.setSubmitting(true)
        await axios.put(`subjects/${id}`, values)
        .then((res) => {
            alert.setAlert('success', 'Subject Updated!');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update Subject!');
        });
    };

    const handleFetchTeachers = async () => {
        setFetching(true);
        await axios.get(`users/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            let fetched = res.data.data;
            setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        })
        .catch(() => {
            alert.setAlert("error", 'Failed to fetch Teachers');
        })
        .finally(() => {
            setFetching(false);
        });
    };

    const formik = useFormik({
        initialValues: {
            title: title,
            start_time: start_time,
            end_time: end_time,
            subject_teacher: subject_teacher,
            section_id: section_id,
            schedule: schedule
        },
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    useEffect(() => {
        if(open){
            handleFetchTeachers();
        }
    }, [open]);

    return(
        <>
        <IconButton size='small' color='primary' onClick={() => handleModalState()}>
            <EditIcon fontSize='small' />
        </IconButton>
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className='fw-bolder'>Update Subject Details</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('title')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="Start Time" variant="outlined" {...formik.getFieldProps('start_time')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="End Time" variant="outlined" {...formik.getFieldProps('end_time')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            disabled={fetching}
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                                formik.setFieldValue('subject_teacher', newValue.id)
                                handleFetchScheduleConflict(newValue.id);
                            }}
                            defaultValue={subject_teacher}
                            isOptionEqualToValue={(option, value) => console.log(option === value)}
                            getOptionKey={(option) => option}
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
                        {/* <FormControl>
                            <InputLabel id="grade_level_label">Schedule</InputLabel>
                            <Select labelId="grade_level_label" label="Schedule" fullWidth defaultValue={'daily'} {...formik.getFieldProps('schedule')} disabled={formik.isSubmitting}>
                                <MenuItem value={"daily"}>Daily</MenuItem>
                                <MenuItem value={"mwf"}>Monday, Wednesday, Friday</MenuItem>
                                <MenuItem value={"tth"}>Tuesday, Thursday</MenuItem>
                            </Select>
                        </FormControl> */}
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