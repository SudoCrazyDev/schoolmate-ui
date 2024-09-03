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

export default function EditSubject({subject, refresh}){
    const [open, setOpenModal] = useState(false);
    const alert = useAlert();
    const {id: institutionId} = GetActiveInstitution();
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(false);

    const {
        id,
        title,
        start_time,
        end_time,
        schedule
    } = subject;

    const assigned_teacher = subject.expand?.assigned_teacher;

    const handleModalState = () => {
        setOpenModal(!open);
    };

    const handleSubmit = async (values) => {
        formik.setSubmitting(true)
        try {
            await pb.collection("section_subjects")
            .update(id, {...values, assigned_teacher: values.assigned_teacher.id});
            alert.setAlert('success', 'Subject updated successfully');
            refresh();
            handleModalState();
        } catch (error) {
            console.log(error);
            alert.setAlert('error', 'Subject updated failed');
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleFetchTeachers = async () => {
        setFetching(true);
        try {
            const records = await pb.collection("user_relationships")
            .getList(1, 10, {
                expand: 'user,personal_info,roles',
                filter: `institutions~"${institutionId}" && roles!~"fodxbvsy6176gxd"`
            })
            setTeachers(records.items);
        } catch (error) {
            alert.setAlert('error', "Failed to load Teachers.")
        } finally {
            setFetching(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: title,
            start_time: start_time,
            end_time: end_time,
            assigned_teacher: assigned_teacher,
            schedule: schedule
        },
        onSubmit: handleSubmit
    });

    useEffect(() => {
        if(open){
            handleFetchTeachers();
        }
    }, [open]);

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
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('title')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="Start Time" variant="outlined" {...formik.getFieldProps('start_time')} disabled={formik.isSubmitting}/>
                        <TextField type="time" label="End Time" variant="outlined" {...formik.getFieldProps('end_time')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            disabled={fetching}
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disableClearable
                            getOptionDisabled={(option) => option.id === "sample"}
                            onChange={(event, newValue) =>{
                                formik.setFieldValue('assigned_teacher', newValue);
                            }}
                            defaultValue={assigned_teacher}
                            getOptionKey={(option) => option.id}
                            getOptionLabel={(option) => `${String(option.expand?.personal_info.last_name).toUpperCase()} ${String(option.expand?.personal_info.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        />
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