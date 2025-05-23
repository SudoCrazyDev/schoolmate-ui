import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import AdvisoryMissingGrades from './components/AdvisoryMissingGrades';

export default function ClassAdvisorySummary(){
    const { advisory_id } = useParams();
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [maleStudents, setMaleStudents] = useState([]);
    const [generalStudents, setGeneralStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const [conflictGrades, setConflictGrades] = useState([]);
    
    const handleFetchAdvisoryDetails = async () => {
        await axios.get(`institution_sections/${advisory_id}`)
        .then((res) => {
            let fetched_students = res.data.students || [];
            let male_students = fetched_students?.filter(student => student.gender === 'male');
            let female_students = fetched_students?.filter(student => student.gender === 'female');
            setGeneralStudents(fetched_students);
            setMaleStudents(male_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setFemaleStudents(female_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setAdvisory(res.data);
        });
    };

    const handleRating = (value) => {
        let numVal = Number(Number(value).toFixed());
        if(numVal >= 90 && numVal <= 94){
            return 'WITH HONORS'
        }
        if(numVal >= 95 && numVal <= 98){
            return 'WITH HIGH HONORS'
        }
        if(numVal >= 99 && numVal <= 100){
            return 'WITH HIGHEST HONORS'
        }
        return '';
    };

    const handleStudentRanking = () => {
        let students = advisory?.students.map((student) => {
            return {
                full_name: `${student.last_name}, ${student.first_name} ${String(student.middle_name).charAt(0)}.`,
                gen_ave: student.grades.length > 0 ? Number(Number(student.grades.reduce((acc, curr) => {
                    return acc + Number(Number(curr.grade).toFixed());
                }, 0) / student.grades.length ).toFixed()) : 0
            };
        });
        return students?.sort((a,b) => b.gen_ave - a.gen_ave) || [];
    };

    const handleCheckStudentsMultipleGrades = () => {
        const students_with_duplicate_grades = [];
        for(let i = 0; i < generalStudents.length; i++){
            let student = generalStudents[i];
            let duplicated_grades = [];
            let graded_subjects = new Set();
            let dupli_grades_title = new Set();
            for(const grade of student.grades){
                const grade_subject = String(grade.subject.title).toLowerCase();
                if(graded_subjects.has(grade_subject)){
                    dupli_grades_title.add(grade_subject);
                }
                graded_subjects.add(grade_subject);
            }
            dupli_grades_title.forEach((subject) => {
                let subjects = student.grades?.filter(grade => String(grade.subject.title).toLowerCase() == subject);
                if(subjects.length > 0){
                    students_with_duplicate_grades.push({
                        full_name: `${student.last_name}, ${student.first_name}`,
                        subjects
                    });
                }
            });
        }
        setConflictGrades(students_with_duplicate_grades.sort((a,b) => b.full_name - a.full_name));
    };
    
    const studentRankings = useMemo(handleStudentRanking, [advisory]);

    useEffect(() => {
        handleFetchAdvisoryDetails();
    }, [advisory_id]);
    
    useEffect(() => {
        if(generalStudents.length != 0){
            handleCheckStudentsMultipleGrades();
        }
    }, [generalStudents]);

    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body d-flex flex-row">
                        <h2 className="m-0 fw-bolder">{advisory && `${advisory?.grade_level} - ${advisory?.title}`}</h2>
                        <div className="ms-auto gap-2 d-flex flex-row align-items-center">
                            <NavLink to={`/advisory/students/${advisory_id}`}>
                                <Button variant="contained" className='fw-bold'>
                                    Students
                                </Button>
                            </NavLink>
                            <NavLink to={`/advisory/core-values/${advisory_id}`}>
                                <Button variant="contained" className='fw-bold'>
                                    Core Values
                                </Button>
                            </NavLink>
                            <NavLink to={`/advisory/attendance/${advisory_id}`}>
                                <Button variant="contained" className='fw-bold'>
                                    Attendance
                                </Button>
                            </NavLink>
                            <NavLink to={`/advisory-grades/${advisory_id}`}>
                                <Button variant="contained" className='fw-bold'>
                                    Report Card
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2 d-flex flex-row justify-content-between">
                <div className="col-3 p-1">
                    <div className="card ">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{maleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>MALE</h1>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1">
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{femaleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>FEMALE</h1>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1">
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{femaleStudents.length + maleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>TOTAL</h1>
                        </div>
                    </div>
                </div>
            </div>
            <AdvisoryMissingGrades advisory={advisory}/>
            <div className="col-5 p-2">
                <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                        <h5 className="m-0 fw-bolder">GRADE CONFLICT</h5>
                        <p className="m-0" style={{ fontSize: '12px' }}>Students having multiple grades.</p>
                        <hr />
                        <table className="table">
                            <tbody>
                                {/* {conflictGrades.map((conflict, i) => (
                                    <tr key={i}>
                                        <td width={`50%`} className="fw-bolder text-uppercase" style={{ verticalAlign: 'middle' }}>{conflict.full_name}</td>
                                        <td width={`50%`} style={{ verticalAlign: 'middle' }}>
                                            <div className="d-flex flex-column">
                                                {conflict.subjects.map((subject,i) => (
                                                    <p className="m-0 text-uppercase" key={i} style={{ fontSize: '12px'}}>
                                                        {`${subject.subject.title} - ${subject.subject.subject_teacher.last_name}`}
                                                    </p>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                        <h5 className="m-0 fw-bolder">ACHIEVERS</h5>
                        <p className="m-0" style={{ fontSize: '12px' }}>Ranking of students.</p>
                        <hr />
                        <table className="table table-striped">
                            <tbody>
                                {studentRankings.map((student, index) => (
                                    <>
                                    {handleRating(student.gen_ave) !== '' && (
                                        <tr key={index}>
                                            <td width={`50%`} className='fw-bold text-uppercase'>{student.full_name}</td>
                                            <td width={`10%`} className='fw-bold'>{student.gen_ave}</td>
                                            <td width={`40%`} className='fw-bold'>{handleRating(student.gen_ave)}</td>
                                        </tr>
                                    )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex flex-row justify-content-center">
                <div className="col-12 p-2">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="m-0 fw-bolder">CLASS SCHEDULE</h5>
                            <hr />
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>SUBJECT</th>
                                        <th>TEACHER</th>
                                        <th>SCHEDULE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {advisory?.subjects?.map((subject) => (
                                        <tr key={subject.id}>
                                            <td className='text-uppercase fw-bold'>{subject.title}</td>
                                            <td className='text-uppercase fw-bold'>{subject.subject_teacher?.first_name} {subject.subject_teacher?.last_name}</td>
                                            <td className='text-uppercase fw-bold'>{subject.start_time} - {subject.end_time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}