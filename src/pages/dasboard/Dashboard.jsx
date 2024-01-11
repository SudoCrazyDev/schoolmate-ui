import Divider from '@mui/material/Divider'
import Axios from "axios";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export default function Dashboard(){
    const {token, user, institutions} = useSelector(state => state.user);
    const [advisory, setAdvisory] = useState([]);
    
    const handleAccept = (student_id) => {
        Axios.post('section/student/request/accept', {student_id: student_id, user_id: token})
        .then(({data}) => {
            setAdvisory(data.advisory);
        });
    };
    
    const handleDelete = (student_id) => {
        Axios.post('section/student/request/delete', {student_id: student_id, user_id: token})
        .then(({data}) => {
            setAdvisory(data.advisory);
        });
    };
    
    const handleFetchAdvisoryStudents = () => {
        Axios.get(`section/student/request/${token}`)
        .then(({data}) => {
            setAdvisory(data.advisory);
        });
    };
    
    useEffect(() => {
        handleFetchAdvisoryStudents()
    }, []);
    
    return(
        <div className="d-flex flex-column">
            <h1 className="m-0">Student Request</h1>
            <h6 className='m-0'>
                {import.meta.env.VITE_APP_URL}form/{institutions.id}/{user.advisory[0]?.grade_level.grade_level}/{user.advisory[0]?.section_name.toLowerCase()}
            </h6>
            <div className="my-2">
                <Divider />
            </div>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th className='fw-bold'>Name</th>
                        <th className='fw-bold'>Email</th>
                        <th className='fw-bold'>Contact #</th>
                        <th className='fw-bold'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {advisory && advisory[0] && advisory[0].student_request && advisory[0].student_request.map((student, index) => (
                        <tr key={index}>
                            <td className={`m-0 ${student.student.is_accepted && 'bg-success text-white'}`}>
                                {student.student.details.first_name} {student.student.details.last_name}
                            </td>
                            <td className={`m-0 ${student.student.is_accepted && 'bg-success text-white'}`}>
                                {student.student.email}
                            </td>
                            <td className={`m-0 ${student.student.is_accepted && 'bg-success text-white'}`}>
                                {student.student.details.phone}
                            </td>
                            <td>
                                {!student.student.is_accepted && (
                                    <>
                                        <IconButton size='small' onClick={() => handleAccept(student.student.id)}>
                                            <CheckIcon color="primary" size='small'/>
                                        </IconButton>
                                        <IconButton size='small' onClick={() => handleDelete(student.student.id)}>
                                            <DeleteIcon color="error" size='small'/>
                                        </IconButton>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}