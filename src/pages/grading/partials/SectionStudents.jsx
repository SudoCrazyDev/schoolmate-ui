import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';
import Skeleton from '@mui/material/Skeleton';
import SubmitChanges from './SubmitChanges';
import RequestForChange from './RequestForChange';

export default function SectionStudents({selectedSubject}){
    const [fetching, setFetching] = useState(false);
    const [students, setStudents] = useState([]);
    const [changes, setChanges] = useState([]);
    const alert = useAlert();
    
    const handleChangeGrade = (grading, student, index, value) => {
        const user_id = student.student.id;
        const existingIndex = changes.findIndex((change) => change.user_id === user_id);
        
        if(existingIndex !== -1){
            setChanges((prevChanges) => {
                const updatedChanges = [...prevChanges];
                updatedChanges[existingIndex] = {
                    ...updatedChanges[existingIndex],
                    value: Number(value),
                };
                return updatedChanges;
            });
        } else {
            setChanges((prevChanges) => [
                ...prevChanges,
                {
                    user_id: user_id,
                    subject_id: selectedSubject.id,
                    value: Number(value),
                    grading: grading,
                    first_name: student?.student?.details?.first_name,
                    last_name: student?.student?.details?.last_name,
                },
            ]);
        }
    };
    
    const GetGrading = (grading, student, index) => {
        if(student.grades.length > 0){
            const filteredGrade = student.grades.filter(grade => Number(grade.grading) === grading && selectedSubject.id === grade.subject_id);
            if(filteredGrade.length === 0){
                return <TextField variant="standard" size="small" onChange={(e) => handleChangeGrade(grading, student, index, e.target.value)}/>
            }else{
                return Number(filteredGrade[0].value);
            }
        }else{
            return <TextField variant="standard" size="small" onChange={(e) => handleChangeGrade(grading, student, index, e.target.value)}/>
        }
    };
    
    const handleFetchStudentAndGrades = () => {
        setFetching(true);
        Axios.get(`subject/students/${selectedSubject?.id}`)
        .then(({data}) => {
            const sortedStudents = data.sort((a, b) => {
                if(a.student?.details?.last_name.toLowerCase() < b.student?.details?.last_name.toLowerCase()) return -1;
                if(a.student?.details?.last_name.toLowerCase() > b.student?.details?.last_name.toLowerCase()) return 1;
            });
            setStudents(sortedStudents);
        })
        .catch(() => {
            alert.setAlert('error', 'Error fetching students');
        })
        .finally(() => {
            setFetching(false);
        })
    };
    
    useEffect(() => {
        if(selectedSubject){
            handleFetchStudentAndGrades()
        }
    },[selectedSubject]);
    return(
        <>
        <div className="d-flex flex-row my-2">
            <TextField variant="outlined" size="small" label="Student Filter"/>
            <div className="ms-auto">
                <SubmitChanges setStudents={setStudents} changes={changes} setChanges={setChanges} students={students}/>
            </div>
        </div>
        <table className='table'>
            <thead>
                <tr>
                    <th className='fw-bold'>NAME</th>
                    <th className='fw-bold'>G1</th>
                    <th className='fw-bold'>G2</th>
                    <th className='fw-bold'>G3</th>
                    <th className='fw-bold'>G4</th>
                    <th className='fw-bold'>FINAL</th>
                    <th className='fw-bold'>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {fetching && (
                    <tr>
                        <td>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                        <td>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                        <td>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                        <td>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                        <td>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                        <td colSpan={2}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </td>
                    </tr>
                )}
                {!fetching && students.map((student, i) => (
                    <tr key={i}>
                        <td width={'30%'}>
                            {student.student.details.last_name}, {student.student.details.first_name}
                        </td>
                        <td width={'10%'}>
                            {GetGrading(1, student, i)}
                        </td>
                        <td width={'10%'}>
                            {/* {GetGrading(2, student, i)} */}
                        </td>
                        <td width={'10%'}>
                            {/* {GetGrading(3, student, i)} */}
                        </td>
                        <td width={'10%'}>
                            {/* {GetGrading(4, student, i)} */}
                        </td>
                        <td width={'10%'}>
                            
                        </td>
                        <td width={'20%'}>
                            <RequestForChange student={student} selectedSubject={selectedSubject}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );
};