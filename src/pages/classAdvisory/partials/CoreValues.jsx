import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import { useAlert } from '../../../hooks/CustomHooks';
import SubmitCoreValues from './SubmitCoreValues';
import { useSelector } from 'react-redux';

export default function CoreValues(){
    const { advisory_id } = useParams();
    const { institutions } = useSelector(state => state.user);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [selectedBehaviour, setSelectedBehaviour] = useState("md-1");
    const [coreValues, setCoreValues] = useState([]);
    const [access, setAccess] = useState([]);
    const alert = useAlert();
    
    const handleFetchAdvisoryDetails = async () => {
        setFetching(true);
        await axios.get(`institution_sections/${advisory_id}`)
        .then((res) => {
            let fetched_students = res.data.students || [];
            let male_students = fetched_students?.filter(student => student.gender === 'male');
            let female_students = fetched_students?.filter(student => student.gender === 'female');
            setMaleStudents(male_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setFemaleStudents(female_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setAdvisory(res.data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    const handleCoreValue = (student_id, quarter, remarks) => {
        let newCoreValues = [...coreValues];
        const existingIndex = newCoreValues.findIndex(coreValue => coreValue.student_id === student_id && coreValue.quarter === quarter && coreValue.core_value === selectedBehaviour);
        if(existingIndex !== -1){
            newCoreValues[existingIndex].remarks = remarks;
        }else{
            newCoreValues.push({
                academic_year: '2024-2025',
                student_id,
                quarter,
                core_value: selectedBehaviour,
                remarks
            });
        }
        setCoreValues(newCoreValues);
    };
     
    const handleCheckForGradingAccess = async () => {
        await axios.get(`meta/grade_access/${institutions[0].id}`)
        .then((res) => {
            setAccess(res.data.data);
        });
    };
    
    const handleSelectInput = (student, quarter, core_value) => {
        let student_value = student?.values.filter(value => value.core_value === core_value && value.quarter === quarter)?.[0] || false;
        if(student_value){
            return <select value={coreValues.filter(coreValue => coreValue.student_id === student.id && coreValue.quarter === quarter && coreValue.core_value === selectedBehaviour)?.[0]?.remarks || student_value.remarks} className="form-select" onChange={(e) => handleCoreValue(student.id, quarter, e.target.value)}>
                    <option value={`AO`}>Always Observed</option>
                    <option value={`SO`}>Sometimes Observed</option>
                    <option value={`RO`}>Rarely Observed</option>
                    <option value={`NO`}>Not Observed</option>
                </select>
        } else {
            return <select value={coreValues.filter(coreValue => coreValue.student_id === student.id && coreValue.quarter === quarter && coreValue.core_value === selectedBehaviour)?.[0]?.remarks || 'AO'} className="form-select" onChange={(e) => handleCoreValue(student.id, quarter, e.target.value)}>
                    <option value={`AO`}>Always Observed</option>
                    <option value={`SO`}>Sometimes Observed</option>
                    <option value={`RO`}>Rarely Observed</option>
                    <option value={`NO`}>Not Observed</option>
                </select>
        }
    };
    
    useEffect(() => {
        handleFetchAdvisoryDetails();
        handleCheckForGradingAccess();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">{advisory && `${advisory?.grade_level} - ${advisory?.title}`}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>STUDENTS CORE VALUES</p>
                    </div>
                    <div className="ms-auto">
                        <SubmitCoreValues coreValues={coreValues} refresh={handleFetchAdvisoryDetails}/>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th width={'30%'}></th>
                                    <th colSpan={5} className='text-center'>
                                        <FormControl className='w-100 text-center' variant="standard">
                                            <InputLabel className='text-center'>Behaviour Statements</InputLabel>
                                            <Select value={selectedBehaviour} label="Core Values" fullWidth onChange={(e) => setSelectedBehaviour(e.target.value)}>
                                                <ListSubheader>MAKA-DIYOS</ListSubheader>
                                                    <MenuItem value={"md-1"} className='text-uppercase'>
                                                        Expresses one's spritals beliefs while
                                                        respecting the spiritual beliefs of others
                                                    </MenuItem>
                                                    <MenuItem value={"md-2"} className='text-uppercase'>
                                                        Show adherence to ethical principles
                                                        by upholding truth
                                                    </MenuItem>
                                                <ListSubheader>MAKA TAO</ListSubheader>
                                                    <MenuItem value={"mt-1"} className='text-uppercase'>
                                                        Is sensitive to individual, social and cultural differences
                                                    </MenuItem>
                                                    <MenuItem value={"mt-2"} className='text-uppercase'>
                                                    Demonstrates contributions towards solidarity
                                                    </MenuItem>
                                                <ListSubheader>MAKA KALIKASAN</ListSubheader>
                                                    <MenuItem value={"mk-1"} className='text-uppercase'>
                                                    Cares for the environment and utilizes resources wisely, judiciously, and economically
                                                    </MenuItem>
                                                <ListSubheader>MAKA BANSA </ListSubheader>
                                                    <MenuItem value={"mb-1"} className='text-uppercase'>
                                                    Demonstrates pride in being a Filipino; excercises the rights and responsibilities of a Filipino citizen.
                                                    </MenuItem>
                                                    <MenuItem value={"mb-2"} className='text-uppercase'>
                                                    Demonstrates appropriate behaviour in carrying out activities in the school, community, and country.
                                                    </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th width={'30%'}>STUDENT</th>
                                    <th width={`15%`} className='text-center'>1st</th>
                                    <th width={`15%`} className='text-center'>2nd</th>
                                    <th width={`15%`} className='text-center'>3rd</th>
                                    <th width={`15%`} className='text-center'>4th</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching && Array(10).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7}>
                                            <Skeleton variant="text" sx={{ fontSize: '1rem', height: '40px' }} />
                                        </td>
                                    </tr>
                                ))}
                                {!fetching && (
                                    <tr>
                                        <td colSpan={7} className='fw-bolder h2'>MALE</td>
                                    </tr>
                                )}
                                {!fetching && maleStudents.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className='text-uppercase fw-bold'>{student.last_name}, {student.first_name}</td>
                                        <td>
                                            {handleSelectInput(student, '1', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '2', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '3', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '4', selectedBehaviour)}
                                        </td>
                                    </tr>
                                ))}
                                {!fetching && (
                                    <tr>
                                        <td colSpan={7} className='fw-bolder h2'>FEMALE</td>
                                    </tr>
                                )}
                                {!fetching && femaleStudents.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className='text-uppercase fw-bold'>{student.last_name}, {student.first_name}</td>
                                        <td>
                                            {handleSelectInput(student, '1', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '2', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '3', selectedBehaviour)}
                                        </td>
                                        <td>
                                            {handleSelectInput(student, '4', selectedBehaviour)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};