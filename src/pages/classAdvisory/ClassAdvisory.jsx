import { useSelector } from 'react-redux';
import ViewGrades from './partials/ViewGrades';
import Axios from 'axios';
import { useAlert } from '../../hooks/CustomHooks';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import pb from '../../global/pb';
import ViewClassSchedule from './partials/ViewClassSchedule';

export default function ClassAdvisory(){
    const { user, info } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const [fetching, setFetching] = useState(false);
    const alert = useAlert();
    
    const handleFetchAdvisoryStudents = async () => {
        setFetching(true);
        try {
            const records = await pb.collection('institution_sections')
            .getFullList({
                filter: `class_adviser="${info.id}"`
            })
            if(records.length > 0){
                setAdvisory(records[0]);
                const fetched_students = await pb.collection("student_base")
                .getFullList({
                    filter: `section="${records[0].id}"`,
                    expand: `student_personal_data_via_student`
                });
                setStudents(fetched_students);
            }
        } catch (error) {
            
        }
        setFetching(false);
    };
    
    useEffect(() => {
        handleFetchAdvisoryStudents();
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
                        <ViewClassSchedule section={advisory}/>
                        {/* <NavLink to={'/advisory/bulk-new-student'}>
                            <Button variant="contained" className='fw-bolder'>BULK STUDENT</Button>
                        </NavLink> */}
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
                                        <td>{student.expand?.student_personal_data_via_student?.[0]?.last_name}, {student.expand?.student_personal_data_via_student?.[0]?.first_name}</td>
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