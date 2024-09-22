import { useEffect, useState } from 'react';
import Axios from 'axios';
import { getUserId } from '../../global/Helpers';
import { useAlert } from '../../hooks/CustomHooks';
import SectionStudents from './partials/SectionStudents';

export default function StudentsGrading(){
    const user_id = getUserId();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const alert = useAlert();
    
    const handleFetchSubjects = () => {
        Axios.get(`teacher/subjects/${user_id}`)
        .then(({data}) => {
            setSubjects(data);
        })
    };
    
    useEffect(() => {
        if(user_id) {
            handleFetchSubjects();
        }
    },[user_id]);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bold">Subject Assignation</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>Student Grades and assigned subjects.</p>
                    </div>
                </div>
            </div>
            <div className="col-3 p-2">
                <div className="card p-3">
                    {subjects.map((subject, index) => (
                        <div key={index} className="d-flex flex-row align-items-center align-items-center class-section" onClick={() => setSelectedSubject(subject)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{subject.section.grade_level.grade_level} - {subject.section.section_name.toUpperCase()}</h6>
                            <h6 className="m-0 ms-auto" style={{padding: '8px'}}>{subject.subject_title}</h6>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-9 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <h5 className="m-0 fw-bolder">{selectedSubject?.section.grade_level.grade_level} - {selectedSubject?.section.section_name} STUDENTS</h5>
                                <p className="m-0 text-muted fw-bolder" style={{fontSize: '12px'}}>Class adviser: {selectedSubject?.section.adviser.details.first_name} {selectedSubject?.section.adviser.details.last_name}</p>
                            </div>
                            <div className="ms-auto">
                                
                            </div>
                        </div>
                        <div className="d-flex flex-column mt-1">
                            <hr />
                        </div>
                        <SectionStudents selectedSubject={selectedSubject} />
                    </div>
                </div>
            </div>
        </div>
    );
};