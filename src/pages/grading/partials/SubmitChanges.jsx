import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';

export default function SubmitChanges({changes, students, setStudents, setChanges}){
    const [open, setOpen] = useState(false);
    const [sortedChanges, setSortedChanges] = useState([]);
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert();
    
    const handleCheckBox = () => {
        setAgreed(!agreed);
    };
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSubmitChanges = () => {
        setSubmitting(true);
        Axios.post('subject/grades/submit', {changes: changes})
        .then(({data}) => {
            setStudents(data);
            alert.setAlert('success', 'Grades submitted successfully');
            setChanges([]);
            handleCheckBox();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Error on submitting grades');
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    const GetStudentCurrentGradingValue = (grading, changeStudent) => {
        const filteredResult = students.filter(student => student.user_id === changeStudent.user_id);
        if(filteredResult.length > 0){
            const grade = filteredResult[0].grades.filter(curGrade => curGrade.grading === grading);
            if(grade.length > 0){
                return grade[0].value;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    };
    
    useEffect(() => {
        const sortedStudents = changes.sort((a, b) => {
            if(a.first_name.toLowerCase() < b.first_name.toLowerCase()) return -1;
            if(a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
        });
        setSortedChanges(sortedStudents);
    }, [changes]);
    
    return(
        <>
        <Button variant="contained" color="primary" disabled={changes.length === 0} onClick={() => handleModalState()}>Save Changes</Button>
        <Dialog scroll='paper' open={open} maxWidth="md" fullWidth>
            <form>
            <DialogContent dividers>
            <table className='table'>
                <thead>
                    <tr>
                        <th className='fw-bold'>Student</th>
                        <th className='fw-bold'>Grading</th>
                        <th className='fw-bold'>Current</th>
                        <th className='fw-bold'>New</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedChanges.map((change, index) => (
                        <tr key={index}>
                            <td>{change.first_name.charAt(0)}.{change.last_name}</td>
                            <td>{change.grading}</td>
                            <td>{Number(GetStudentCurrentGradingValue(change.grading, change))}</td>
                            <td>{Number(change.value)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}>
                            <p className='m-0 fst-italic fw-bold'>Once submitted, you'll not be able to edit this anymore. Please review carefully.</p>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                            <div className="d-flex flex-row align-items-center">
                                <Checkbox className="m-0" checked={agreed} onClick={() => handleCheckBox()}/>
                                <p className='m-0 fst-italic fw-normal' style={{fontSize: '14px'}}>I hereby affirm that all grades provided are accurate and have been verified for correctness.</p>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            </DialogContent>
            <DialogActions className='p-3 justify-content-start'>
                <Button size='small' variant="contained" color="primary" disabled={!agreed || submitting} onClick={() => handleSubmitChanges()}>Submit</Button>
                <Button size='small' variant="contained" color="error" onClick={() => handleModalState()} disabled={submitting}>Cancel</Button>
            </DialogActions>
            </form>
        </Dialog>
        </>
    );
};