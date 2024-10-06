import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmitGrades from "./components/SubmitGrades";
import { useSelector } from "react-redux";

export default function StudentSubjectGrades(){
    const { subject_id } = useParams();
    const { institutions } = useSelector(state => state.user);
    const [subject, setSubject] = useState(null);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [gradeAdd, setGradeAdd] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [access, setAccess] = useState([]);
    
    const handleCheckForGradingAccess = async () => {
        await axios.get(`meta/grade_access/${institutions[0].id}`)
        .then((res) => {
            setAccess(res.data.data);
        });
    };
    
    const handleAddSubject = (student, value, quarter) => {
        let newGrades = [...gradeAdd];
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
    
    const handleInput = (quarter, student) => {
        let quarter_one = access[0]?.quarter_one;
        let quarter_two = access[0]?.quarter_two;
        let quarter_three = access[0]?.quarter_three;
        let quarter_four = access[0]?.quarter_four;
        
        if(quarter === 1){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === '1')?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === '1')?.[student.grades.length - 1]?.is_locked || 0;
            if(quarter_one){
                if(quarter_grade === ""){
                    return <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '1')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                }else{
                    return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                    }
                }
            }
        }
        
        if(quarter === 2){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === '2')?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === '2')?.[student.grades.length - 1]?.is_locked || 0;
            if(quarter_two){
                if(quarter_grade === ""){
                    return <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '2')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                }else{
                    return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                    }
                }
            }
        }
        
        if(quarter === 3){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === '3')?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === '3')?.[student.grades.length - 1]?.is_locked || 0;
            if(quarter_three){
                if(quarter_grade === ""){
                    return <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '3')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                }else{
                    return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                    }
                }
            }
        }
        
        if(quarter === 4){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === '4')?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === '4')?.[student.grades.length - 1]?.is_locked || 0;
            if(quarter_four){
                if(quarter_grade === ""){
                    return <input type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === '4')?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                }else{
                    return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <input type="number" defaultValue={quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                    }
                }
            }
        }
    };
    
    useEffect(() => {
        handleFetchSubjectDetails();
        handleCheckForGradingAccess();
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
                                        {handleInput(1, student)}
                                    </td>
                                    <td>
                                        {handleInput(2, student)}
                                    </td>
                                    <td>
                                        {handleInput(3, student)}
                                    </td>
                                    <td>
                                        {handleInput(4, student)}
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
                                        {handleInput(1, student)}
                                    </td>
                                    <td>
                                        {handleInput(2, student)}
                                    </td>
                                    <td>
                                        {handleInput(3, student)}
                                    </td>
                                    <td>
                                        {handleInput(4, student)}
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