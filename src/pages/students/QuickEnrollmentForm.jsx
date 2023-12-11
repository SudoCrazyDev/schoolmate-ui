import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useFormik } from 'formik';
import { useAlert } from '../../hooks/CustomHooks';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function QuickEnrollmentForm(){
    const alert = useAlert();
    let {grade, section} = useParams();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [open, setOpen] = useState(false);
    const [sectionId, setSectionId] = useState("");
    
    const handleValidateUrl = () => {
      setLoading(true);
      Axios.post('validate/enrollment-form', {grade_level: grade, section: section.toUpperCase()})
      .then(({data}) => {
        formik.setFieldValue('section', data.section);
        setSectionId(data.section);
        setLoading(false);
      })
      .catch((err) => {
        setInvalid(true);
      });
    };
    
    const handleSubmit = (values) => {
      setLoading(true);
      Axios.post('submit/enrollment-form', values)
      .then((res) => {
        setLoading(false);
        setOpen(true);
        formik.resetForm();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error Submitting Form');
        setLoading(false);
      });
    };
    
    const formik = useFormik({
      initialValues: {
        first_name: '',
        last_name: '',
        gender: 'male',
        birthdate: new Date().toLocaleDateString('en-CA'),
        phone: '',
        address: '',
        email: '',
        section: sectionId,
        grade: grade,
      },
      onSubmit: handleSubmit,
    });
    
    useEffect(() => {
      handleValidateUrl()
    }, []);
    
    
    return(
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="d-flex flex-column align-items-center">
                <h1 className="m-0 fw-bolder">Student Form</h1>
                <h2 className='m-0 text-uppercase fw-bolder'>{grade} - {section}</h2>
            </div>
            {invalid && (
              <div className="bg-danger text-white card p-4">
                <h5 className="m-0">Invalid Url</h5>
              </div>
            )}
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-row flex-wrap" style={{ maxWidth: '420px'}}>
                  <TextField className="col-12 col-md-6 p-1 my-1" label="First Name" variant="outlined" disabled={loading} {...formik.getFieldProps('first_name')}/>
                  <TextField className="col-12 col-md-6 p-1 my-1" label="Last Name" variant="outlined" disabled={loading} {...formik.getFieldProps('last_name')}/>
                  <Select displayEmpty className="col-12 p-1 my-1" label="Gender" size='small' {...formik.getFieldProps('gender')}>
                      <MenuItem value={'male'}>MALE</MenuItem>
                      <MenuItem value={'female'}>FEMALE</MenuItem>
                  </Select>
                  <TextField type="date" className="col-12 p-1 my-1" label="Birthdate" variant="outlined" disabled={loading} {...formik.getFieldProps('birthdate')} />
                  <TextField className="col-12 p-1 my-1" label="Phone" variant="outlined" disabled={loading} {...formik.getFieldProps('phone')}/>
                  <TextField className="col-12 p-1 my-1" label="Address" variant="outlined" disabled={loading} {...formik.getFieldProps('address')}/>
                  <TextField className="col-12 p-1 my-1" label="Email Address" variant="outlined" disabled={loading} {...formik.getFieldProps('email')}/>
                  <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>Submit</Button>
              </div>
            </form>
            <Dialog open={open} maxWidth="md" fullWidth>
              <DialogContent>
                  <div className="d-flex flex-column align-items-center">
                    <h1 className="m-0 text-bolder">THANK YOU!</h1>
                    <h4 className="m-0 text-bolder">Your form has been submitted.</h4>
                    <h4 className="m-0 text-bolder">Wait for your Adviser's instructions.</h4>
                    <h6 className="m-0 text-bolder text-muted mt-2">You may now close this window.</h6>
                  </div>
              </DialogContent>
            </Dialog>
        </div>
    );
}