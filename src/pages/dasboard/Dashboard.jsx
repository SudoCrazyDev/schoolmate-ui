import Divider from '@mui/material/Divider'
import Axios from "axios";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export default function Dashboard(){
    const token = useSelector(state => state.user.token);
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
                            <td className={`${student.user.is_accepted && 'bg-success text-white'}`}>
                                {student.user.details.first_name} {student.user.details.last_name}
                            </td>
                            <td className={`${student.user.is_accepted && 'bg-success text-white'}`}>
                                {student.user.email}
                            </td>
                            <td className={`${student.user.is_accepted && 'bg-success text-white'}`}>
                                {student.user.details.phone}
                            </td>
                            <td>
                                {!student.user.is_accepted && (
                                    <>
                                        <IconButton onClick={() => handleAccept(student.user.id)}>
                                            <CheckIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(student.user.id)}>
                                            <DeleteIcon color="error"/>
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