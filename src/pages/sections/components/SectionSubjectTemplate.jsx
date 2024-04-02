import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Axios from 'axios';
import { useFormik } from "formik";
import { useAlert } from '../../../hooks/CustomHooks';
import { useSelector } from 'react-redux';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SectionSubjectTemplate(){
    const [open, setOpen] = useState(false);
    const { teachers } = useSelector(state => state.org);
    const alert = useAlert()
    
    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };
    
    const handleSubmit = (values) => {
      formik.setSubmitting(true);
      Axios.post('section/subject/add', values)
      .then(({data}) => {
        setSubjects(data);
        alert.setAlert('success', 'Subject Added successfully');
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
        subjects:[],
        selectedSubject:{
          subject_title: '',
          start_time: "07:30",
          end_time: '08:30',
          schedule: ['mon']
        },
        
      },
      enableReinitialize: true,
      onSubmit: handleSubmit
    });
    
    const handleSwap = (index, subject, type) => {
      let swapIndex = 0;
      if(type === 'increment'){
        swapIndex = index + 1;
      }
      if(type === 'decrease'){
        swapIndex = index - 1;
      }
      let swapIndexContent = formik.values.subjects[swapIndex];
      let tempSubjects = formik.values.subjects;
      tempSubjects[index] = swapIndexContent;
      tempSubjects[swapIndex] = subject;
      formik.setFieldValue('subjects', tempSubjects)
    };
    
    const removeSubject = (index) => {
      let tempSubjects = formik.values.subjects;
      tempSubjects.splice(index, 1);
      formik.setFieldValue('subjects', tempSubjects)
    };
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={() => setOpen(true)}>Section Subjects Template</Button>
        <Dialog open={open} maxWidth="xl" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Set Subjects for all Sections</DialogTitle>
            <Divider />
            <DialogContent className='d-flex flex-row'>
                <div className="col-3 p-2 d-flex flex-column gap-3">
                    <TextField label="Subject Title" variant="outlined" disabled={formik.isSubmitting} {...formik.getFieldProps('selectedSubject.subject_title')}/>
                    <TextField type="time" label="Start Time" defaultValue={'20:30'} variant="outlined" {...formik.getFieldProps('selectedSubject.start_time')} disabled={formik.isSubmitting}/>
                    <TextField type="time" label="End Time" defaultValue={'19:30'} variant="outlined" {...formik.getFieldProps('selectedSubject.end_time')} disabled={formik.isSubmitting}/>
                    <FormControl>
                        <InputLabel id="grade_level_label">Schedule</InputLabel>
                        <Select multiple labelId="grade_level_label" label="Schedule" fullWidth {...formik.getFieldProps('selectedSubject.schedule')} disabled={formik.isSubmitting}>
                            <MenuItem value={"mon"} className={`${formik.values.selectedSubject.schedule.includes('mon') && 'fw-bolder'}`}>Monday</MenuItem>
                            <MenuItem value={"tue"} className={`${formik.values.selectedSubject.schedule.includes('tue') && 'fw-bolder'}`}>Tuesday</MenuItem>
                            <MenuItem value={"wed"} className={`${formik.values.selectedSubject.schedule.includes('wed') && 'fw-bolder'}`}>Wednesday</MenuItem>
                            <MenuItem value={"thu"} className={`${formik.values.selectedSubject.schedule.includes('thu') && 'fw-bolder'}`}>Thursday</MenuItem>
                            <MenuItem value={"fri"} className={`${formik.values.selectedSubject.schedule.includes('fri') && 'fw-bolder'}`}>Friday</MenuItem>
                            <MenuItem value={"sat"} className={`${formik.values.selectedSubject.schedule.includes('sat') && 'fw-bolder'}`}>Saturday</MenuItem>
                            <MenuItem value={"sun"} className={`${formik.values.selectedSubject.schedule.includes('sun') && 'fw-bolder'}`}>Sunday</MenuItem>
                        </Select>
                    </FormControl>
                    <Divider />
                    <div className="d-flex flex-row mt-2 gap-2">
                        <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={formik.isSubmitting}
                        className='fw-bolder'
                        onClick={() => {
                          formik.setFieldValue('subjects', [...formik.values.subjects, formik.values.selectedSubject]);
                          formik.setFieldValue('selectedSubject',{
                            subject_title: '',
                            start_time: "07:30",
                            end_time: '08:30',
                            schedule: ['mon']
                          })
                        }}
                        >
                          Add {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}
                        </Button>
                        <Button color='error' size='small' variant="contained" disabled={formik.isSubmitting} onClick={() => handleCloseModal()}>Cancel</Button>
                    </div>
                </div>
                <div className="col-9 p-2">
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Subject</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Schedule</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.subjects.map((subject,i) => (
                        <tr key={i}>
                          <td width={'2%'}></td>
                          <td width={'40%'}>{subject.subject_title}</td>
                          <td width={'15%'}>{subject.start_time}</td>
                          <td width={'15%'}>{subject.end_time}</td>
                          <td width={'15%'}>{subject.schedule.toString()}</td>
                          <td width={'13%'}>
                              <IconButton size='small' color='primary' disabled={i === 0} onClick={() => handleSwap(i, subject, 'decrease')}>
                                  <FileUploadIcon />
                              </IconButton>
                              <IconButton size='small' color='primary' disabled={i === formik.values.subjects.length - 1} onClick={() => handleSwap(i, subject, 'increment')}>
                                  <GetAppIcon />
                              </IconButton>
                              <IconButton size='small' color='error' onClick={() => removeSubject(i)}>
                                  <DeleteIcon />
                              </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex flex-row gap-2">
                    <Button color='primary' size='small' variant="contained" disabled={formik.isSubmitting}>Submit</Button>
                  </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}