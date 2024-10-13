import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useAlert } from '../../../hooks/CustomHooks';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Tooltip } from '@mui/material';

export default function EditSection({section}){
    const {institutions} = useSelector(state => state.user);
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
      formik.resetForm();
      setOpen(!open);
    };
    
    const handleFetchTeachers = async () => {
      setFetching(true);
      await axios.get(`users/all_by_institutions/${institutions[0].id}`)
      .then((res) => {
          let fetched = res.data.data;
          setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
      })
      .catch(err => {
          alert.setAlert('error', 'Failed to fetch Teachers');
      })
      .finally(() => {
          setFetching(false);
      });
  };
  
    const handleSubmit = (values) => {
      try {
        
      } catch (error) {
        
      }
      // Axios.put(`section/update/${section.id}`, values)
      // .then(({data}) => {
      //     alert.setAlert('success', 'Section updated successfully')
      //     dispatch(actions.SET_GRADELEVELS(data));
      //     handleModalState();
      // })
      // .catch(() => {
      //   alert.setAlert('error', 'Failed updating section')
      // })
      // .finally(() => {
      //   formik.setSubmitting(false);
      // });
    };
    
    const formik = useFormik({
        initialValues: {
          section_name: section.title,
          class_adviser: section.class_adviser.id
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
        <Tooltip title="Edit Section">
          <IconButton className='ms-auto' size='small' color="info" onClick={handleModalState}>
              <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
            <DialogTitle className='fw-bolder'>Update Section</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Section Name" variant="outlined" disabled={formik.isSubmitting} {...formik.getFieldProps('section_name')}/>
                        <Autocomplete
                            disabled={formik.isSubmitting}
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('class_adviser', newValue.id);
                            }}
                            defaultValue={section.class_adviser}
                            getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField {...params} label="Class Adviser" />}
                        />
                        <Divider />
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>Submit</Button>
                            <Button type="button" variant="contained" color="error" onClick={handleModalState} disabled={formik.isSubmitting}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}