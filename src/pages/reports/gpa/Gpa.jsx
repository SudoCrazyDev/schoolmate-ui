import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoopIcon from '@mui/icons-material/Loop';
export default function Gpa(){
    const [fetchingSections, setFetchingSections] = useState(false);
    const [fetchingGrades, setFetchingGrades] = useState(false);
    const [fetchingSubjects, setFetchingSubjects] = useState(false);
    const [grade7Subjects, setGrade7Subjects] = useState([]);
    const [grade8Subjects, setGrade8Subjects] = useState([]);
    const [grade9Subjects, setGrade9Subjects] = useState([]);
    const [grade10Subjects, setGrade10Subjects] = useState([]);
    const user = useSelector(state => state.user);
    
    const handleFetchSections = async () => {
        await axios.get(`institution_sections/all_by_institutions/${user.institutions[0].id}/grades`)
        .then(res => {
            let sections = res.data || [];
            
            //Filter Sections by Grade level
            let grade7_sections = sections.filter(section => section.grade_level === '7' && !String(section.title).includes('OHSP'));
            let grade8_sections = sections.filter(section => section.grade_level === '8' && !String(section.title).includes('OHSP'));
            let grade9_sections = sections.filter(section => section.grade_level === '9' && !String(section.title).includes('OHSP'));
            let grade10_sections = sections.filter(section => section.grade_level === '10' && !String(section.title).includes('OHSP'));

            //Get Subjects Per Sections
            let grade7_subjects = grade7_sections.map(section => section.subjects).flat();
            let grade8_subjects = grade8_sections.map(section => section.subjects).flat();
            let grade9_subjects = grade9_sections.map(section => section.subjects).flat();
            let grade10_subjects = grade10_sections.map(section => section.subjects).flat();

            const grouped_grade7_subjects = grade7_subjects.reduce((acc, obj) => {
                const existing = acc.find(item => item.title === obj.title);
                if (existing) {
                    existing.student_grades = [...existing.student_grades, ...obj.student_grades];
                } else {
                    acc.push({ title: obj.title, student_grades: obj.student_grades });
                }
                return acc;
            }, []);
            const grouped_grade8_subjects = grade8_subjects.reduce((acc, obj) => {
                const existing = acc.find(item => item.title === obj.title);
                if (existing) {
                    existing.student_grades = [...existing.student_grades, ...obj.student_grades];
                } else {
                    acc.push({ title: obj.title, student_grades: obj.student_grades });
                }
                return acc;
            }, []);
            const grouped_grade9_subjects = grade9_subjects.reduce((acc, obj) => {
                const existing = acc.find(item => item.title === obj.title);
                if (existing) {
                    existing.student_grades = [...existing.student_grades, ...obj.student_grades];
                } else {
                    acc.push({ title: obj.title, student_grades: obj.student_grades });
                }
                return acc;
            }, []);
            const grouped_grade10_subjects = grade10_subjects.reduce((acc, obj) => {
                const existing = acc.find(item => item.title === obj.title);
                if (existing) {
                    existing.student_grades = [...existing.student_grades, ...obj.student_grades];
                } else {
                    acc.push({ title: obj.title, student_grades: obj.student_grades });
                }
                return acc;
            }, []);
            setGrade7Subjects(grouped_grade7_subjects);
            setGrade8Subjects(grouped_grade8_subjects);
            setGrade9Subjects(grouped_grade9_subjects);
            setGrade10Subjects(grouped_grade10_subjects);
        });
    };
    
    const handleGetAverage = (subject, quarter) => {
        let subjects = subject.student_grades.filter(grade => grade.quarter == String(quarter)) || [];
        let total = subjects.reduce((acc, grade) => acc + Number(grade.grade), 0);
        return isNaN(Number(total/subjects.length).toFixed(2)) ? '-' : Number(total/subjects.length).toFixed(2);
    };
    
    const handlePassingRate = (subject, quarter) => {
        let passing_grades = subject.student_grades.filter(grade => grade.quarter == String(quarter) && Number(grade.grade) >= 80) || [];
        let failed_grades = subject.student_grades.filter(grade => grade.quarter == String(quarter) && Number(grade.grade) <= 79) || [];
        let total_grades = passing_grades.length + failed_grades.length;
        return {
            passing: Number((passing_grades.length / total_grades) * 100).toFixed(2) + "%",
            failed: Number((failed_grades.length / total_grades) * 100).toFixed(2) + "%"
        };
    };
    
    useEffect(() => {
        handleFetchSections();
    }, []);
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-column">
                    <h2 className="m-0 fw-bolder">GPA</h2>
                    <p className="m-0 fst-italic" style={{fontSize: '12px'}}>Reports for GPA</p>
                </div>
            </div>
            <div className="d-flex flex-row flex-wrap mt-2">
                <div className="col-12 p-2">
                    <h2 className="fw-bolder">GRADE 7</h2>
                </div>
                {grade7Subjects.map((subject, index) => (
                    <div key={index} className="col-3 p-2">
                        <div className="card">
                            <div className="card-body d-flex flex-column align-items-center gap-2">
                                <p className="m-0 fw-bolder text-uppercase text-center">{subject.title}</p>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q1</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 1)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q2</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q3</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q4</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).failed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-12 p-2">
                    <h2 className="fw-bolder">GRADE 8</h2>
                </div>
                {grade8Subjects.map((subject, index) => (
                    <div key={index} className="col-3 p-2">
                        <div className="card">
                            <div className="card-body d-flex flex-column align-items-center gap-2">
                                <p className="m-0 fw-bolder text-uppercase text-center">{subject.title}</p>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q1</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 1)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q2</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q3</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q4</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).failed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-12 p-2">
                    <h2 className="fw-bolder">GRADE 9</h2>
                </div>
                {grade9Subjects.map((subject, index) => (
                    <div key={index} className="col-3 p-2">
                        <div className="card">
                            <div className="card-body d-flex flex-column align-items-center gap-2">
                                <p className="m-0 fw-bolder text-uppercase text-center">{subject.title}</p>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q1</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 1)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q2</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q3</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q4</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).failed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-12 p-2">
                    <h2 className="fw-bolder">GRADE 10</h2>
                </div>
                {grade10Subjects.map((subject, index) => (
                    <div key={index} className="col-3 p-2">
                        <div className="card">
                            <div className="card-body d-flex flex-column align-items-center gap-2">
                                <p className="m-0 fw-bolder text-uppercase text-center">{subject.title}</p>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q1</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 1)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handlePassingRate(subject, 1).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q2</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 2).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q3</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 3).failed}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-row w-100 gap-3 justify-content-center">
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center">Q4</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4)}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-success">80 Above</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).passing}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-1">
                                        <p className="m-0 fw-bolder text-uppercase text-center text-danger">80 Below</p>
                                        <p className="m-0 fw-bolder text-uppercase text-center">{handleGetAverage(subject, 4).failed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};