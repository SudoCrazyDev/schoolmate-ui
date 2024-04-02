import TextField from '@mui/material/TextField';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useFormik } from "formik";
import Axios from "axios";
import { useAlert } from '../../../hooks/CustomHooks';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BulkStudent(){
    const { user } = useSelector(state => state.user);
    const navigate  = useNavigate();
    const alert = useAlert();
    
    const handleAddStudent = () => {
        if(!formik.values.basic_information.first_name) return;
        formik.setFieldValue('students', [...formik.values.students, {...formik.values.basic_information}]);
        formik.setFieldValue('basic_information', {
            first_name: '',
            middle_name: '',
            last_name: '',
            ext_name: '',
            birthdate: new Date().toLocaleDateString('af-ZA'),
            gender: 'male',
            religion: 'catholic',
            lrn: '',
        });
    };
    
    const handleRemoveStudent = (index) => {
        let students = formik.values.students;
        const newStudents = students.filter((_, i) => i !== index);
        formik.setFieldValue('students', newStudents);
    };
    
    const handleSubmit = (values) => {
        formik.setSubmitting(true);
        Axios.post('student/bulk', values)
        .then(() => {
            alert.setAlert('success', 'Please wait for the students to be added...');
            formik.resetForm();
            setTimeout(() => {navigate('/advisory');}, 1500);
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to add multiple students');
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const handleCancel = () => {
        formik.resetForm();
        navigate('/advisory');
    };
    
    const formik = useFormik({
        initialValues:{
            students: [],
            section: user.advisory[0].id,
            basic_information:{
                first_name: '',
                middle_name: '',
                last_name: '',
                ext_name: '',
                birthdate: new Date().toLocaleDateString('af-ZA'),
                gender: 'male',
                religion: 'catholic',
                lrn: '',
            },
        },
        onSubmit: handleSubmit
    });
    
    console.log(formik.values);
    return(
        <div className="d-flex flex-column">
            <form onSubmit={formik.handleSubmit}>
                <div className="d-flex flex-row">
                    <div className="col-8 d-flex flex-column gap-2">
                        <div className="d-flex flex-row flex-wrap align-items-center">
                            <div className="p-2 col-4">
                                <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="First Name"
                                fullWidth
                                {...formik.getFieldProps('basic_information.first_name')}
                                error={formik.touched.basic_information?.first_name && !formik.values.basic_information?.first_name}
                                helperText={formik.touched.basic_information?.first_name && !formik.values.basic_information?.first_name && `Required`}
                                />
                            </div>
                            <div className="p-2 col-4">
                                <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Middle Name"
                                fullWidth
                                {...formik.getFieldProps('basic_information.middle_name')}
                                />
                            </div>
                            <div className="p-2 col-4">
                                <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Last Name"
                                fullWidth
                                {...formik.getFieldProps('basic_information.last_name')}
                                />
                            </div>
                            <div className="p-2 col-4">
                                <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Extension Name"
                                placeholder='eg. Jr. Sr. III'
                                fullWidth
                                {...formik.getFieldProps('basic_information.ext_name')}
                                />
                            </div>
                            <div className="p-2 col-4">
                                <TextField
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                variant='outlined'
                                size='small'
                                label="Birthday"
                                fullWidth
                                {...formik.getFieldProps('basic_information.birthdate')}
                                />
                            </div>
                            <div className="p-2 col-4">
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select labelId='gender-label' label="Gender" fullWidth size='small' {...formik.getFieldProps('basic_information.gender')}>
                                        <MenuItem value={'male'}>Male</MenuItem>
                                        <MenuItem value={'female'}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="p-2 col-4">
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Religion</InputLabel>
                                    <Select labelId='gender-label' label="religion" fullWidth size='small' {...formik.getFieldProps('basic_information.religion')}>
                                        <MenuItem value={'islam'}>ISLAM</MenuItem>
                                        <MenuItem value={'catholic'}>CATHOLIC</MenuItem>
                                        <MenuItem value={'inc'}>IGLESIA NI CRISTO</MenuItem>
                                        <MenuItem value={'baptist'}>BAPTIST</MenuItem>
                                        <MenuItem value={'others'}>OTHERS</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="p-2 col-8">
                                <TextField inputProps={{className: 'text-uppercase'}} variant='outlined' size='small' label="LRN" fullWidth {...formik.getFieldProps('basic_information.lrn')}></TextField>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row gap-2">
                    <Button type='button' variant='contained' className='fw-bolder' disabled={formik.isSubmitting} onClick={() => handleAddStudent()}>
                        Add
                        {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}
                    </Button>
                    <Button variant='contained' color='error' className='fw-bolder' disabled={formik.isSubmitting} onClick={() => handleCancel()}>Cancel</Button>
                </div>
                <div className="d-flex flex-column my-3">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className='fw-bolder'>Name</th>
                                <th className='fw-bolder'>LRN</th>
                                <th className='fw-bolder'>Gender</th>
                                <th className='fw-bolder'>Religion</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {formik.values.students && formik.values.students.map((student, i) => (
                                <tr key={i}>
                                    <td className='text-uppercase fw-bolder'>{student.last_name}, {student.first_name}</td>
                                    <td>{student.lrn}</td>
                                    <td className='text-capitalize'>{student.gender}</td>
                                    <td className='text-uppercase'>{student.religion}</td>
                                    <td>
                                        <IconButton color="error" onClick={() => handleRemoveStudent(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button type='submit' variant='contained' className='fw-bolder' disabled={!formik.values.students.length || formik.isSubmitting}>
                    Submit
                    {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}
                </Button>
            </form>
        </div>
    );
};