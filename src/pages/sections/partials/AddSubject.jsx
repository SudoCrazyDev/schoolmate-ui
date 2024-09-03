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

export default function AddSubject({selectedSection, handleFetchSectionSubjects}){
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const {id} = GetActiveInstitution();
    const alert = useAlert()
    
    const handleFetchTeachers = async () => {
      try {
        const records = await pb.collection("user_relationships")
          .getFullList({
              expand: 'user,personal_info,roles',
              filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd"`
          });
          setTeachers(records);
      } catch (error) {
        console.log(error);
        alert.setAlert("error", "Failed to load teacher")
      }
    };
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };

    
    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      try {
        await pb.collection("section_subjects")
        .create({
            institution: id,
            section: selectedSection.id,
            title: values.subject_title,
            start_time: values.start_time,
            end_time: values.end_time,
            schedule: values.schedule,
            assigned_teacher: values.user_id
        });
        handleFetchSectionSubjects();
        handleCloseModal();
      } catch (error) {
        alert.setAlert("error", "Failed to add subject")
      } finally {
        formik.setSubmitting(true);
      }
      // Axios.post('section/subject/add', values)
      // .then(({data}) => {
      //   setSubjects(data);
      //   alert.setAlert('success', 'Subject Added successfully');
      //   handleCloseModal();
      // })
      // .catch((err) => {
      //   alert.setAlert('error', 'Error on adding subject');
      // })
      // .finally(() => {
      //   formik.setSubmitting(false);
      // });
    };
    
    const formik = useFormik({
      initialValues:{
        subject_title: '',
        section_id: selectedSection.id,
        user_id: '',
        start_time: "07:30",
        end_time: '08:30',
        schedule: 'daily'
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
        <Button variant="contained" className='fw-bolder' onClick={() => setOpen(true)}>Add Subject</Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add New Subject for {selectedSection.section_name}</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Subject Title" variant="outlined" {...formik.getFieldProps('subject_title')} disabled={formik.isSubmitting}/>
                        <Autocomplete
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disableClearable
                            getOptionDisabled={(option) => option.id === "sample"}
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('user_id', newValue.id);
                            }}
                            getOptionLabel={(option) => `${String(option.expand?.personal_info.last_name).toUpperCase()} ${String(option.expand?.personal_info.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        />
                        {/* <Autocomplete
                            disabled={formik.isSubmitting}
                            id="combo-box-demo"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('user_id', newValue.id);
                            }}
                            getOptionLabel={(option) => `${option.details?.first_name} ${option.details?.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        /> */}
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