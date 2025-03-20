import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import {  useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from '../../hooks/CustomHooks';

export default function AdvisoryAttendance(){
    const { advisory_id } = useParams();
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [schoolDays, setSchoolDays] = useState(null);
    const [advisory, setAdvisory] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [changedRecords, setChangedRecords] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const alert = useAlert()
    const academic_year = "2024-2025";
    
    const handleFetchAdvisoryDetails = async () => {
        setFetching(true);
        await axios.get(`institution_sections/${advisory_id}`)
            .then((res) => {
                let fetched_students = res.data.students || [];
                let male_students = fetched_students?.filter(student => student.gender === 'male');
                let female_students = fetched_students?.filter(student => student.gender === 'female');
    
                const sortStudents = (students) => {
                    return students.sort((a, b) => {
                        const lastNameComparison = a.last_name.localeCompare(b.last_name);
                        if (lastNameComparison !== 0) {
                            return lastNameComparison;
                        }
                        return a.first_name.localeCompare(b.first_name);
                    });
                };
    
                setMaleStudents(sortStudents(male_students));
                setFemaleStudents(sortStudents(female_students));
                
                let school_days = res.data.institution.school_days || [];
                setSchoolDays(school_days.filter(schoolDay => schoolDay.academic_year === academic_year)?.[0] || null);
                
                setAdvisory(res.data);
            })
            .finally(() => {
                setFetching(false);
            });
    };
    
    const getStudentAttendance = (student, month, acad) => {
        let student_attendance = student.attendance.filter(attendance => attendance.academic_year === acad) || [];
        if(student_attendance.length === 0){
            return <input disabled={submitting} type="number" min={0} className="form-control" onChange={(e) => handleChangeStudentAttendance(e.target.value, student.id, month, acad)}/>
        }
        return <input disabled={submitting} type="number" min={0} className="form-control" defaultValue={student_attendance[0][month]} onChange={(e) => handleChangeStudentAttendance(e.target.value, student.id, month, acad)}/>
    };
    
    const handleChangeStudentAttendance = (value, student_id, month, acad) => {
        setChangedRecords((prevRecords) => {
            const existingRecordIndex = prevRecords.findIndex(
              (record) => record.student_id === student_id
            );
        
            if (existingRecordIndex !== -1) {
              return prevRecords.map((record, index) => {
                if (index === existingRecordIndex) {
                  return {
                    ...record,
                    [month]: parseInt(value),
                  };
                }
                return record;
              });
            } else {
              return [
                ...prevRecords,
                {
                  student_id: student_id,
                  academic_year: acad,
                  [month]: parseInt(value),
                },
              ];
            }
        });
    };
    
    const handleSubmit = async () => {
        if(schoolDays === null){
            alert.setAlert('error', 'No Default School Days Found!');
            return;
        }
        setSubmitting(true);
        await axios.post('school_days/update_advisory', {records: changedRecords})
        .then(() => {
            handleFetchAdvisoryDetails();
            alert.setAlert("success", "Students Attendance Updated!");
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    useEffect(() => {
        handleFetchAdvisoryDetails();
    }, []);
    
    console.log(schoolDays);
    
    return(
        <div className="d-flex flex-column">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">{advisory && `${advisory?.grade_level} - ${advisory?.title}`}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>track students attendance.</p>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-primary" onClick={() => handleSubmit()} disabled={submitting}>
                            {submitting && <div className='spinner-border spinner-border-sm'></div>}
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width={'18%'} className="text-secondary">Student</th>
                                <th width={'6%'} className="text-secondary text-center">Jan</th>
                                <th width={'6%'} className="text-secondary text-center">Feb</th>
                                <th width={'6%'} className="text-secondary text-center">Mar</th>
                                <th width={'6%'} className="text-secondary text-center">Apr</th>
                                <th width={'6%'} className="text-secondary text-center">May</th>
                                <th width={'6%'} className="text-secondary text-center">Jun</th>
                                <th width={'6%'} className="text-secondary text-center">Jul</th>
                                <th width={'6%'} className="text-secondary text-center">Aug</th>
                                <th width={'6%'} className="text-secondary text-center">Sep</th>
                                <th width={'6%'} className="text-secondary text-center">Oct</th>
                                <th width={'6%'} className="text-secondary text-center">Nov</th>
                                <th width={'6%'} className="text-secondary text-center">Dec</th>
                                <th width={'10%'} className="text-secondary"></th>
                            </tr>
                        </thead>
                        <thead>
                            {!schoolDays && (
                                <tr>
                                    <th colSpan={14} className="text-secondary">NO School Days Set!</th>
                                </tr>
                            )}
                            {schoolDays && (
                                <tr>
                                    <th width={'18%'} className="text-secondary">School Days</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.jan}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.feb}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.mar}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.apr}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.may}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.jun}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.jul}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.aug}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.sep}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.oct}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.nov}</th>
                                    <th width={'6%'} className="text-secondary text-center">{schoolDays.dec}</th>
                                    <th width={'10%'} className="text-secondary"></th>
                                </tr>
                            )}
                        </thead>
                        <thead>
                            <tr>
                                <th colSpan={14} className="text-dark fw-bolder h4">MALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && (
                                <tr>
                                    <td colSpan={14}>
                                        <Skeleton variant="rect"/>
                                    </td>
                                </tr>
                            )}
                            {!fetching && maleStudents.map(maleStudent => (
                                <tr key={maleStudent.id}>
                                    <th width={'18%'} className="v-center text-dark fw-bolder text-uppercase">{maleStudent.last_name}, {maleStudent.first_name}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jan', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'feb', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'mar', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'apr', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'may', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jun', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jul', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'aug', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'sep', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'oct', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'nov', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'dec', academic_year)}</th>
                                    <th width={'10%'} className="text-secondary"></th>
                                </tr>
                            ))}
                        </tbody>
                        <thead>
                            <tr>
                                <th colSpan={14} className="text-dark fw-bolder h4">FEMALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && (
                                <tr>
                                    <td colSpan={14}>
                                        <Skeleton variant="rect"/>
                                    </td>
                                </tr>
                            )}
                            {!fetching && femaleStudents.map(maleStudent => (
                                <tr key={maleStudent.id}>
                                    <th width={'18%'} className="v-center text-dark fw-bolder text-uppercase">{maleStudent.last_name}, {maleStudent.first_name}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jan', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'feb', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'mar', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'apr', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'may', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jun', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'jul', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'aug', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'sep', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'oct', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'nov', academic_year)}</th>
                                    <th width={'6%'} className="text-secondary text-center">{getStudentAttendance(maleStudent, 'dec', academic_year)}</th>
                                    <th width={'10%'} className="text-secondary"></th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};