import { useSelector } from 'react-redux';
import ViewGrades from './partials/ViewGrades';
import Axios from 'axios';
import { useAlert } from '../../hooks/CustomHooks';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function ClassAdvisory(){
    const { user } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(false);
    const alert = useAlert();
    
    const handleFetchAdvisoryStudents = () => {
        setFetching(true);
        Axios.get(`section/students/${user.advisory[0].id}`)
        .then(({data}) => {
            setStudents(data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    useEffect(() => {
        handleFetchAdvisoryStudents();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">CLASS ADVISORY - {user.advisory[0].section_name}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>view your students progress.</p>
                    </div>
                    <div className="ms-auto">
                        <NavLink to={'/advisory/new-student'}>
                            <Button variant="contained" className='fw-bolder me-2'>NEW STUDENT</Button>
                        </NavLink>
                        <NavLink to={'/advisory/bulk-new-student'}>
                            <Button variant="contained" className='fw-bolder'>BULK STUDENT</Button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='fw-bold'>Student</th>
                                    <th className='fw-bold'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching && (
                                    <tr>
                                        <td colSpan={2}>
                                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                        </td>
                                    </tr>
                                )}
                                {!fetching && students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.student.details.last_name}, {student.student.details.first_name}</td>
                                        <td>
                                            <ViewGrades student={student} />
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