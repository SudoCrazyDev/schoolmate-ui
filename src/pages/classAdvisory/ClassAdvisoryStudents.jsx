import { Button, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DisableStudent from "./partials/DisableStudent";
import JHSCoc from "./components/JHSCoc";
import SHSDiploma from "./components/SHSDiploma";

export default function ClassAdvisoryStudents(){
    const { advisory_id } = useParams();
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [maleStudents, setMaleStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const [fetching, setFetching] = useState(false);
    
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
    
    const handleStudentGenAve = (student, quarter) => {
        let mapeh_subjects = student.grades?.filter(grade => grade.subject.parent_subject !== null);
        let mapeh_ave = mapeh_subjects.reduce((acc, curr) => {
            if(curr.quarter == quarter){
                return acc + Number(Number(curr.grade).toFixed());
            }else{
                return acc;
            }
        }, 0) / mapeh_subjects.length;
        let student_grade = student.grades.reduce((acc, curr) => {
            if(curr.quarter == quarter && curr.subject.parent_subject == null){
                return acc + Number(Number(curr.grade).toFixed());
            }else{
                return acc;
            }
        }, 0);
        let grade_count = student.grades.filter(grade => grade.quarter == quarter && grade.subject.parent_subject == null).length + 1;
        return Number(Number((student_grade + mapeh_ave) / grade_count).toFixed()).toFixed() == 'NaN' ? "-" : Number(Number((student_grade + mapeh_ave) / grade_count).toFixed()).toFixed();
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
    
    // const students = useMemo(handleStudentGrades, [advisory_id]);
    
    useEffect(() => {
        handleFetchAdvisoryDetails();
    }, [advisory_id]);
    
    return(
        <div className="d-flex flex-row flex-wrap gap-1">
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body d-flex flex-row">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 fw-bold text-uppercase">{advisory?.grade_level}-{advisory?.title}</h2>
                            <p className="m-0 fw-light" style={{fontSize: '12px'}}>Manage your students.</p>
                        </div>
                        <div className="ms-auto">
                            <NavLink to={`/advisory/new-student/${advisory?.id}`}>
                                <Button variant="contained" className='fw-bolder me-2'>NEW STUDENT</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body d-flex flex-column">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="fw-bold h5 text-center" colSpan={8}>GEN. AVE</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th width={`20%`} className="fw-bolder"></th>
                                    <th width={`10%`} className="fw-bolder text-center">1st</th>
                                    <th width={`10%`} className="fw-bolder text-center">2nd</th>
                                    <th width={`10%`} className="fw-bolder text-center">3rd</th>
                                    <th width={`10%`} className="fw-bolder text-center">4th</th>
                                    <th width={`10%`} className="fw-bolder text-center">Final</th>
                                    <th width={`15%`} className="fw-bolder text-center">Rating</th>
                                    <th width={`15%`} className="fw-bolder text-center">Actions</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th className="fw-bold h3" colSpan={8}>MALE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!fetching && maleStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-normal text-uppercase">{student.last_name}, {student.first_name}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 1)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 2)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 3)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 4)}</td>
                                        <td className="text-center">-</td>
                                        <td className="text-center">{handleRating(handleStudentGenAve(student, 1))}</td>
                                        <td>
                                            <Tooltip title="Update Student Info">
                                                <NavLink to={`/advisory/update-student/${student.id}`}>
                                                    <IconButton size="small" color="primary">
                                                        <EditIcon fontSize='small'/>
                                                    </IconButton>
                                                </NavLink>
                                            </Tooltip>
                                            <JHSCoc advisory={advisory} student={student}/>
                                            <SHSDiploma advisory={advisory} student={student}/>
                                            <DisableStudent student={student} refresh={handleFetchAdvisoryDetails}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <thead>
                                <tr>
                                    <th className="fw-bold h3" colSpan={8}>FEMALE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!fetching && femaleStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-normal text-uppercase">{student.last_name}, {student.first_name}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 1)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 2)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 3)}</td>
                                        <td className="text-center">{handleStudentGenAve(student, 4)}</td>
                                        <td className="text-center">-</td>
                                        <td className="text-center">{handleRating(handleStudentGenAve(student, 1))}</td>
                                        <td>
                                            <Tooltip title="Update Student Info">
                                                <NavLink to={`/advisory/update-student/${student.id}`}>
                                                    <IconButton size="small" color="primary">
                                                        <EditIcon fontSize='small'/>
                                                    </IconButton>
                                                </NavLink>
                                            </Tooltip>
                                            <JHSCoc advisory={advisory} student={student}/>
                                            <SHSDiploma advisory={advisory} student={student}/>
                                            <DisableStudent student={student} refresh={handleFetchAdvisoryDetails}/>
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