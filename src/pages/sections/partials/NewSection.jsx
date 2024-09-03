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
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';
import { actions } from '../../../redux/slices/OrgSlice';
import { GetActiveInstitution } from '../../../global/Helpers';
import pb from '../../../global/pb';

export default function NewSection({refresh}){
    const [open, setOpen] = useState(false);
    const {id}            = GetActiveInstitution();
    const [teachers, setTeachers] = useState([]);
    const [selectedAdviser, setSelectedAdviser] = useState(null);
    const dispatch = useDispatch();
    const alert = useAlert();
    
    const handleModalState = () => {
      formik.resetForm();
      setOpen(!open);
    };
    
    const handleFetchTeachers = async () => {
      try {
          const records = await pb.collection("user_relationships")
          .getFullList({
              expand: 'user,personal_info,roles',
              filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd"`
          });
          setTeachers(records);
      } catch (error) {
          alert.setAlert("error", "Failed to search teacher")
      }
    };
  
    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      try {
        await pb.collection("institution_sections")
        .create({
            institution: id,
            academic_year: '2024-2025',
            grade_level: values.grade_level_id,
            title: values.section_name,
            class_adviser: selectedAdviser.expand?.personal_info?.id,
        });
        alert.setAlert('success', 'New Section added successfully')
        refresh();
        handleModalState();
      } catch (error) {
        console.log(error);
        alert.setAlert('error', 'Failed creating new section')
      } finally {
        formik.setSubmitting(false);
      }
      
      // Axios.post('section/add', values)
      // .then(({data}) => {
      //     
      //     dispatch(actions.SET_GRADELEVELS(data));
      //     handleModalState();
      // })
      // .catch(() => {
      //   
      // })
      // .finally(() => {
      //   
      // });
    };
    
    const formik = useFormik({
        initialValues: {
          section_name: '',
          grade_level_id: '',
          class_adviser: ''
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
        <button className="fw-bolder btn btn-primary" onClick={() => handleModalState()}>New Section</button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
            <DialogTitle className='fw-bolder'>Add New Section</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField id="section_name" label="Section Name" variant="outlined" disabled={formik.isSubmitting} {...formik.getFieldProps('section_name')}/>
                        <FormControl>
                            <InputLabel id="grade_level_label">Grade Level</InputLabel>
                            <Select id="grade_level" labelId="grade_level_label" label="Grade Level" fullWidth onChange={(e) => formik.setFieldValue('grade_level_id', e.target.value)} disabled={formik.isSubmitting}>
                              <MenuItem value={`7`}>Grade 7</MenuItem>
                              <MenuItem value={`8`}>Grade 8</MenuItem>
                              <MenuItem value={`9`}>Grade 9</MenuItem>
                              <MenuItem value={`10`}>Grade 10</MenuItem>
                              <MenuItem value={`11`}>Grade 11</MenuItem>
                              <MenuItem value={`12`}>Grade 12</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disableClearable
                            getOptionDisabled={(option) => option.id === "sample"}
                            onChange={(event, newValue) =>{
                                setSelectedAdviser(newValue);
                            }}
                            getOptionLabel={(option) => `${String(option.expand?.personal_info.last_name).toUpperCase()} ${String(option.expand?.personal_info.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                        />
                        {/* <Autocomplete
                            disabled={formik.isSubmitting}
                            id="class_adviser"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('class_adviser', newValue.id);
                            }}
                            getOptionLabel={(option) => `${option.details?.first_name} ${option.details?.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Class Adviser" />}
                        /> */}
                        <Divider />
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit</Button>
                            <Button variant="contained" color="error" onClick={handleModalState} disabled={formik.isSubmitting}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}