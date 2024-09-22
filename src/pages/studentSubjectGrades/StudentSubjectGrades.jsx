import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmitGrades from "./components/SubmitGrades";

export default function StudentSubjectGrades(){
    const { subject_id } = useParams();
    const [subject, setSubject] = useState(null);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [gradeAdd, setGradeAdd] = useState([]);
    const [fetching, setFetching] = useState(false);
    
    const handleAddSubject = (student, value, quarter) => {
        let newGrades = [...gradeAdd]; // Create a copy of gradeAdd
        const existingIndex = newGrades.findIndex(grade => grade.student_id === student.id && grade.quarter === quarter);
        if (existingIndex !== -1) {
            newGrades[existingIndex].grade = parseFloat(value);
        } else {
            newGrades.push({ student_id: student.id, grade: parseFloat(value), quarter,  subject_id});
        }
        setGradeAdd(newGrades);
    };
    
    const handleFetchSubjectDetails = async () => {
        setFetching(true);
        setGradeAdd([]);
        await axios.get(`subjects/${subject_id}`)
        .then(((res) => {
            let students = res.data.students || [];
            let male = students?.filter(student => student.gender === 'male');
            let female = students?.filter(student => student.gender === 'female');
            setSubject(res.data);
            setMaleStudents(male.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setFemaleStudents(female.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        }))
        .finally(() => {
            setFetching(false);
        });
    };
    useEffect(() => {
        handleFetchSubjectDetails();
    }, [subject_id]);
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-row">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bold">{subject?.title}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>Assign Grades for Students.</p>
                    </div>
                    <div className="ms-auto">
                        <SubmitGrades gradesToSubmit={gradeAdd} refresh={handleFetchSubjectDetails}/>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column">
                    <table className="table table-border">
                    <thead>
                            <tr>
                                <th colSpan={9} className="text-center">QUARTER</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th width={`25%`} className="fw-bolder"></th>
                                <th width={`10%`} className="fw-bolder text-center">1st</th>
                                <th width={`10%`} className="fw-bolder text-center">2nd</th>
                                <th width={`10%`} className="fw-bolder text-center">3rd</th>
                                <th width={`10%`} className="fw-bolder text-center">4th</th>
                                <th width={`10%`} className="fw-bolder text-center">Final</th>
                                <th width={`10%`} className="fw-bolder text-center">Ranking</th>
                                <th width={`10%`} className="fw-bolder text-center">Actions</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th className="fw-bolder h4" colSpan={8}>MALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maleStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="fw-bold" style={{verticalAlign: 'middle'}}>{`${student?.last_name}, ${student?.first_name}`}</td>
                                    <td>
                                        {student.grades.length > 0 && student.grades.filter(grade=>grade.quarter === '1').length > 0 && (
                                            <input type="text" value={student.grades.filter(grade=>grade.quarter === '1')?.[0]?.grade || ''} className="form-control" disabled={student.grades.filter(grade=>grade.quarter === '1')?.[0]?.is_locked || false}/>
                                        )}
                                        {student.grades.length === 0 && student.grades.filter(grade=>grade.quarter === '1').length === 0 && (
                                            <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '1')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                                        )}
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <thead>
                            <tr>
                                <th className="fw-bolder h4" colSpan={8}>FEMALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {femaleStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="fw-bold" style={{verticalAlign: 'middle'}}>{`${student?.last_name}, ${student?.first_name}`}</td>
                                    <td>
                                        {student.grades.length > 0 && student.grades.filter(grade=>grade.quarter === '1').length > 0 && (
                                            <input type="text" value={student.grades.filter(grade=>grade.quarter === '1')?.[0]?.grade || ''} className="form-control" disabled={student.grades.filter(grade=>grade.quarter === '1')?.[0]?.is_locked || false}/>
                                        )}
                                        {student.grades.length === 0 && student.grades.filter(grade=>grade.quarter === '1').length === 0 && (
                                            <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '1')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                                        )}
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};