import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import UnlockStudentGrade from "./StudentUnlock";
import UnlockSection from "./SectionUnlock";

export default function ViewLoads(){
    const { teacher_id } = useParams();
    const [loads, setLoads] = useState([]);
    const [fetchingLoad, setFetchingLoads] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    
    const navigate = useNavigate();
    
    const handleFetchLoads = async () => {
        setFetchingLoads(true);
        await axios.get(`subjects/by_user/${teacher_id}`)
        .then((res) => {
            setLoads(res.data);
        })
        .finally(() => {
            setFetchingLoads(false);
        });
    };
    
    const handleFetchSubjectDetails = async (section_id, load_id) => {
        setFetchingStudents(true);
        await axios.get(`institution_sections/${section_id}`)
        .then((res) => {
            let students = res.data?.students || [];
            let filter_grades = students.map(student => {
                return {
                    ...student,
                    grades: student.grades.filter(grade => grade.subject_id === load_id)
                }
            });
            let male_students = filter_grades.filter(student => student.gender === 'male').sort((a,b) => a.last_name.localeCompare(b.last_name)) || [];
            let female_students = filter_grades.filter(student => student.gender === 'female').sort((a,b) => a.last_name.localeCompare(b.last_name)) || [];
            setMaleStudents(male_students);
            setFemaleStudents(female_students);
        })
        .finally(() => {
            setFetchingStudents(false);
        });
    };
    
    useEffect(() => {
        if(selectedSection){
            handleFetchSubjectDetails();
        }
    }, [selectedSection]);
    
    useEffect(() => {
        handleFetchLoads();
    }, [teacher_id]);
    
    return(
        <div className="d-flex flex-column">
            <div className="d-flex flex-row">
                <IconButton onClick={() => navigate(-1)}>
                    <KeyboardReturnIcon />
                </IconButton>
            </div>
            <div className="d-flex flex-row">
                <div className="col-6 d-flex flex-row flex-wrap">
                    {loads.length === 0 && (
                        <div className="col-12 p-2">
                            <div className="card">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <h3 className="m-0 fw-bolder">NO LOADS FOUND!</h3>
                                </div>
                            </div>
                        </div>
                    )}
                    {fetchingLoad && Array(6).fill().map((_, i) => (
                        <div className="col-6 p-2" key={i}>
                            <Skeleton variant="rect" height={'250px'} className="rounded shadow"/>
                        </div>
                    ))}
                    {!fetchingLoad && loads.map((load, index) => (
                        <div className="col-6 p-2" key={load.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <h3 className="m-0 fw-bold text-uppercase">{load.section?.grade_level} - {load.section?.title}</h3>
                                    <h2 className="m-0 fw-bold text-uppercase">{load.title}</h2>
                                    <div className="d-flex flex-column gap-3 mt-2">
                                        <UnlockSection subject={load}/>
                                        <p className="m-0 fw-bold mt-1 text-center">Lock/Unlock by Student</p>
                                        <button className="btn btn-primary fw-bold" onClick={() => handleFetchSubjectDetails(load.section.id, load.id)}>STUDENT</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-6 d-flex flex-column p-2">
                    {maleStudents.length === 0 && femaleStudents.length === 0 && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="m-0 fw-bolder">NO SELECTED LOAD</h3>
                            </div>
                        </div>
                    )}
                    {maleStudents.length !== 0 && femaleStudents.length !== 0 && (
                        <div className="card">
                            <div className="card-body d-flex flex-column gap-3">
                                <input type="text" className="form-control" placeholder="Search Student"/>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th colSpan={4} className="text-center">QUARTERS</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th>STUDENT</th>
                                            <th width={`15%`}>1st</th>
                                            <th width={`15%`}>2nd</th>
                                            <th width={`15%`}>3rd</th>
                                            <th width={`15%`}>4th</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={5} className="fw-bolder h2">MALE</td>
                                        </tr>
                                        {fetchingStudents && Array(10).fill().map((_,i) => (
                                            <tr key={i}>
                                                <td colSpan={5}><Skeleton variant="rect" height={`30px`}/></td>
                                            </tr>
                                        ))}
                                        {!fetchingStudents && maleStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td className="fw-bold text-uppercase">{student.last_name}, {student.first_name}</td>
                                                <td>
                                                    {student.grades.length > 0 && student.grades.filter(grade => grade.quarter === '1').length > 0 ?
                                                    <UnlockStudentGrade section={student.pivot.section_id} grade={student.grades.filter(grade => grade.quarter === '1')[student.grades.length - 1]} refresh={handleFetchSubjectDetails}/>
                                                    :
                                                    'NO GRADE SUBMITTED'
                                                    }
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={5} className="fw-bolder h2">FEMALE</td>
                                        </tr>
                                        {fetchingStudents && Array(10).fill().map((_,i) => (
                                            <tr key={i}>
                                                <td colSpan={5}><Skeleton variant="rect" height={`30px`}/></td>
                                            </tr>
                                        ))}
                                        {!fetchingStudents && femaleStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td className="fw-bold text-uppercase">{student.last_name}, {student.first_name}</td>
                                                <td>
                                                    {student.grades.length > 0 && student.grades.filter(grade => grade.quarter === '1').length > 0 ?
                                                    <UnlockStudentGrade section={student.pivot.section_id} grade={student.grades.filter(grade => grade.quarter === '1')[student.grades.length - 1]} refresh={handleFetchSubjectDetails}/>
                                                    :
                                                    'NO GRADE SUBMITTED'
                                                    }
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};