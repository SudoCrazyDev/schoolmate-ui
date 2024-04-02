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

export default function NewSection(){
    const [open, setOpen] = useState(false);
    const { teachers, gradeLevels } = useSelector(state => state.org);
    const dispatch = useDispatch();
    const alert = useAlert();
    
    const handleModalState = () => {
      formik.resetForm();
      setOpen(!open);
    };
    
    const handleSubmit = (values) => {
      Axios.post('section/add', values)
      .then(({data}) => {
          alert.setAlert('success', 'New Section added successfully')
          dispatch(actions.SET_GRADELEVELS(data));
          handleModalState();
      })
      .catch(() => {
        alert.setAlert('error', 'Failed creating new section')
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };
    
    const formik = useFormik({
        initialValues: {
          section_name: '',
          grade_level_id: '',
          class_adviser: ''
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={handleModalState}>New Section</Button>
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
                              {gradeLevels.map((gl, index) => (
                                <MenuItem key={index} value={gl.id}>Grade {gl.grade_level}</MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
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
                        />
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