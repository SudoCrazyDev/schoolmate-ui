import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import BasicInfo from '../components/BasicInfo';
import GuardianInfo from '../components/GuardianInfo';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import * as yup from "yup";
import { useFormik } from "formik";
import Axios from "axios";
import { useAlert } from '../../../hooks/CustomHooks';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GetActiveInstitution } from '../../../global/Helpers';
import pb from '../../../global/pb';
import axios from 'axios';
const validationSchema = yup.object().shape({
    basic_information: yup.object().shape({
        first_name: yup.string().required('Required'),
        birthdate: yup.string().required('Required'),
    })
});
export default function NewStudent(){
    const { institutions } = useSelector(state => state.user);
    const {section_id} = useParams();
    const {id} = GetActiveInstitution();
    const navigate  = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const alert = useAlert();
    
    const GetActiveTab = (activeTab, formik) => {
        switch (activeTab) {
            case 0:
                return <BasicInfo formik={formik}/>;
            case 1:
                return <GuardianInfo formik={formik}/>;
            default:
                break;
        }
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        await axios.post('students/add', values)
        .then(() => {
            alert.setAlert('success', 'Student Created!');
            formik.resetForm();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to create Student');
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const handleCancel = () => {
        formik.resetForm();
        navigate(-1);
    };
    
    const formik = useFormik({
        initialValues:{
            section: section_id,
            basic_information:{
                institution_id: institutions[0].id,
                first_name: '',
                middle_name: '',
                last_name: '',
                ext_name: '',
                birthdate: new Date().toLocaleDateString('af-ZA'),
                gender: 'male',
                religion: 'catholic',
                lrn: '',
                psa: '',
                place_of_birth: '',
                is_ip: 0,
                beneficiary: 0,
                address:{
                    current_house_no: '',
                    current_street_name: '',
                    current_barangay: '',
                    current_municipality: '',
                    current_province: '',
                    current_country: '',
                    current_zip_code: '',
                    same_address: 0,
                    permanent_house_no: '',
                    permanent_street_name: '',
                    permanent_barangay: '',
                    permanent_municipality: '',
                    permanent_province: '',
                    permanent_country: '',
                    permanent_zip_code: '',
                },
            },
            parent_guardian: {
                father:{
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    contact_no: ''
                },
                mother:{
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    contact_no: ''
                },
                guardian:{
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    contact_no: ''
                }
            }
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    });
    return(
        <div className="d-flex flex-column">
            <form onSubmit={formik.handleSubmit}>
                <div className="d-flex flex-row">
                    <div className="col-2">
                        <div className="card h-100">
                            <div className="card-body">
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column gap-2">
                        <div className="d-flex flex-row flex-wrap align-items-center">
                            <div className="p-2 col-4">
                                <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="First Name"
                                fullWidth
                                {...formik.getFieldProps('basic_information.first_name')}
                                error={formik.touched.basic_information?.first_name && formik.errors.basic_information?.first_name}
                                helperText={formik.touched.basic_information?.first_name && formik.errors.basic_information?.first_name}
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
                <div className="d-flex flex-column mt-2">
                    <Tabs value={activeTab} aria-label="basic tabs example" className='w-100' onChange={(e, newValue) => setActiveTab(newValue)}>
                        <Tab className="fw-bold" label="BASIC INFORMATION" />
                        <Tab className="fw-bold" label="PARENT/GURADIAN" />
                        {/* <Tab className="fw-bold" label="BALIK ARAL/TRANSFEREE"/>
                        <Tab className="fw-bold" label="SENIOR HIGH"/> */}
                    </Tabs>
                    {GetActiveTab(activeTab, formik)}
                </div>
                <div className="d-flex flex-row gap-2">
                    <Button type='submit' variant='contained' className='fw-bolder' disabled={formik.isSubmitting}>
                        Save
                        {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}
                    </Button>
                    <Button variant='contained' color='error' className='fw-bolder' disabled={formik.isSubmitting} onClick={() => handleCancel()}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};