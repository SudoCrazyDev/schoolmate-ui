import { useSelector } from 'react-redux';
import ViewGrades from './partials/ViewGrades';
import Axios from 'axios';
import { useAlert } from '../../hooks/CustomHooks';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { NavLink, useParams } from 'react-router-dom';
import pb from '../../global/pb';
import ViewClassSchedule from './partials/ViewClassSchedule';
import axios from 'axios';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';

export default function ClassAdvisory(){
    const { advisory_id } = useParams();
    const { user, info } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    const alert = useAlert();
    console.log(advisory);
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
    
    useEffect(() => {
        handleFetchAdvisoryDetails();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                    <h2 className="m-0 fw-bolder">{advisory && `${advisory?.grade_level} - ${advisory?.title}`}</h2>
                    <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>view your students progress.</p>
                    </div>
                    <div className="ms-auto">
                        <NavLink to={`/advisory/new-student/${advisory?.id}`}>
                            <Button variant="contained" className='fw-bolder me-2'>NEW STUDENT</Button>
                        </NavLink>
                        {!fetching && <ViewClassSchedule section={advisory}/>}
                    </div>
                </div>
            </div>
            {/* <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body bg-warning">
                        <h5 className="m-0 text-center fw-bold">Adding of Quarter 2 Grades is Now Open!</h5>
                    </div>
                </div>
            </div> */}
            <div className="col-12 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th width={'30%'}></th>
                                    <th colSpan={5} className='text-center'>QUARTERS {`(GEN. AVERAGE)`}</th>
                                    <th width={'20%'}>ACTIONS</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th width={'30%'}>STUDENT</th>
                                    <th width={'10%'}>1st</th>
                                    <th width={'10%'}>2nd</th>
                                    <th width={'10%'}>3rd</th>
                                    <th width={'10%'}>4th</th>
                                    <th width={'10%'}>Final</th>
                                    <th width={'20%'}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching && (
                                    <tr>
                                        <td colSpan={7}>
                                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={7} className='fw-bolder h2'>MALE</td>
                                </tr>
                                {maleStudents.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className='text-uppercase fw-bold'>{student.last_name}, {student.first_name}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <ViewGrades student={student} subjects={advisory?.subjects}/>
                                            <Tooltip title="Update Student Info">
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize='small'/>
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2} className='fw-bolder h2'>FEMALE</td>
                                </tr>
                                {femaleStudents.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className='text-uppercase fw-bold'>{student.last_name}, {student.first_name}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <ViewGrades student={student} subjects={advisory?.subjects}/>
                                            <Tooltip title="Update Student Info">
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize='small'/>
                                                </IconButton>
                                            </Tooltip>
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