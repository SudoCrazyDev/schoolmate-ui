import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmitGrades from "./components/SubmitGrades";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select, Skeleton } from "@mui/material";
import DeleteGrade from "./components/DeleteGrade";

export default function StudentSubjectGrades(){
    const { subject_id } = useParams();
    const { institutions } = useSelector(state => state.user);
    const [subject, setSubject] = useState(null);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [gradeAdd, setGradeAdd] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [access, setAccess] = useState([]);
    const [mapehComponent, setMapehComponent] = useState("mapeh");
    
    const handleCheckForGradingAccess = async () => {
        await axios.get(`meta/grade_access/${institutions[0].id}`)
        .then((res) => {
            setAccess(res.data.data);
        });
    };
    
    const handleAddSubject = (student, value, quarter) => {
        let newGrades = [...gradeAdd];
        let existingIndex = '';
        if(String(subject?.title).toLowerCase() === 'mapeh'){
            existingIndex = newGrades.findIndex(grade => grade.student_id === student.id && grade.quarter === quarter && grade.subject_id === mapehComponent);
        } else {
            existingIndex = newGrades.findIndex(grade => grade.student_id === student.id && grade.quarter === quarter);
        }
        if (existingIndex !== -1) {
            newGrades[existingIndex].grade = parseFloat(value);
        } else {
            if(String(subject?.title).toLowerCase() === 'mapeh'){
                newGrades.push({ student_id: student.id, grade: parseFloat(value), quarter,  subject_id: mapehComponent});
            }else{
                newGrades.push({ student_id: student.id, grade: parseFloat(value), quarter,  subject_id});
            }
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
    
    const refresh = () => {
        handleFetchSubjectDetails();
        handleCheckForGradingAccess();
    };
    
    const handleInput = (quarter, student) => {
        let quarter_one = access[0]?.quarter_one;
        let quarter_two = access[0]?.quarter_two;
        let quarter_three = access[0]?.quarter_three;
        let quarter_four = access[0]?.quarter_four;
        
        if(quarter === 1){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.is_locked || 0;
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh'){
                quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.grade || "";
                quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.is_locked || 0;
            }
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent === 'mapeh'){
                quarter_grade = Number(student.grades.reduce((accumulator, currentValue) => {
                    return accumulator + Number(currentValue.grade);
                }, 0) / student.grades.length).toFixed(2);
            }
            if(quarter_one){
                if(quarter_grade === ""){
                    return <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                }else{
                    return <div className="input-group">
                                <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                                {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                )}
                                {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                )}
                            </div>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <div className="input-group">
                                    <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter)  && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '1')}/>
                                    {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                    )}
                                    {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                    )}
                                </div>
                    }
                }
            }
        }
        
        if(quarter === 2){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.is_locked || 0;
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh'){
                quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.grade || "";
                quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.is_locked || 0;
            }
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent === 'mapeh'){
                quarter_grade = Number(student.grades.reduce((accumulator, currentValue) => {
                    if(currentValue.quarter === String(quarter)){
                        return accumulator + Number(currentValue.grade);
                    }
                }, 0) / student.grades.length).toFixed(2);
            }
            if(quarter_two){
                if(quarter_grade === ""){
                    return <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                }else{
                    return <div className="input-group">
                                <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                                {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                )}
                                {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                )}
                            </div>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <div className="input-group">
                                    <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter)  && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '2')}/>
                                    {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                    )}
                                    {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                    )}
                                </div>
                    }
                }
            }
        }
        
        if(quarter === 3){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.is_locked || 0;
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh'){
                quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.grade || "";
                quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.is_locked || 0;
            }
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent === 'mapeh'){
                quarter_grade = Number(student.grades.reduce((accumulator, currentValue) => {
                    if(currentValue.quarter === String(quarter)){
                        return accumulator + Number(currentValue.grade);
                    }
                }, 0) / student.grades.length).toFixed(2);
            }
            if(quarter_three){
                if(quarter_grade === ""){
                    return <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                }else{
                    return <div className="input-group">
                                <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                                {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                )}
                                {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                )}
                            </div>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <div className="input-group">
                                    <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter)  && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '3')}/>
                                    {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                    )}
                                    {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                    )}
                                </div>
                    }
                }
            }
        }
        
        if(quarter === 4){
            let quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.grade || "";
            let quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]?.is_locked || 0;
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh'){
                quarter_grade = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.grade || "";
                quarter_grade_access = student.grades.filter(grade=>grade.quarter === String(quarter) && grade.subject_id === mapehComponent)?.[0]?.is_locked || 0;
            }
            if(String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent === 'mapeh'){
                quarter_grade = Number(student.grades.reduce((accumulator, currentValue) => {
                    if(currentValue.quarter === String(quarter)){
                        return accumulator + Number(currentValue.grade);
                    }
                }, 0) / student.grades.length).toFixed(2);
            }
            if(quarter_four){
                if(quarter_grade === ""){
                    return <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || ''} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                }else{
                    return <div className="input-group">
                                <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter) && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                                {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                )}
                                {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                    <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                )}
                            </div>
                }
            }else{
                if(quarter_grade === ""){
                    return <input type="number" className="form-control" disabled={true}/>
                }else{
                    if(quarter_grade_access){
                        return <input type="number" defaultValue={quarter_grade} className="form-control" disabled={true}/>
                    }else{
                        return <div className="input-group">
                                    <input disabled={mapehComponent === 'mapeh' && String(subject?.title).toLowerCase() === 'mapeh'} type="number" value={gradeAdd.filter(grade=>grade.student_id === student.id && grade.quarter === String(quarter)  && (grade.subject_id === mapehComponent || grade.subject_id === subject_id))?.[0]?.grade || quarter_grade} className="form-control" onChange={(e) => handleAddSubject(student, e.target.value, '4')}/>
                                    {String(subject?.title).toLowerCase() === 'mapeh' && mapehComponent !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]} />
                                    )}
                                    {String(subject?.title).toLowerCase() !== 'mapeh' && quarter_grade !== "" && (
                                        <DeleteGrade refresh={refresh} grade={student.grades.filter(grade=>grade.quarter === String(quarter))?.[student.grades.length - 1]}/>
                                    )}
                                </div>
                    }
                }
            }
        }
    };
    
    useEffect(() => {
        refresh();
    }, [subject_id]);
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-row">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bold">{subject?.title}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>Assign Grades to Students.</p>
                    </div>
                    <div className="ms-auto">
                        <SubmitGrades gradesToSubmit={gradeAdd} refresh={refresh}/>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column">
                    <table className="table table-border">
                        <thead>
                            <tr>
                                <th width={`25%`} className="fw-bolder"></th>
                                {subject?.sub_subjects?.length > 0 &&  (
                                    <th colSpan={4}>
                                        <FormControl className='w-100 text-center' variant="standard">
                                            <InputLabel className='text-center'>MAPEH COMPONENTS</InputLabel>
                                            <Select value={mapehComponent} label="MAPEH COMPONENTS" className="text-center" fullWidth onChange={(e) => setMapehComponent(e.target.value)}>
                                                <MenuItem value={`mapeh`} className='text-uppercase'>
                                                    MAPEH
                                                </MenuItem>
                                                {subject.sub_subjects.map((sub_subject) => (
                                                    <MenuItem value={sub_subject.id} className='text-uppercase'>
                                                        {String(sub_subject.title).toUpperCase()}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </th>
                                )}
                                {subject?.sub_subjects?.length === 0 && (
                                    <th colSpan={6} className="text-center">QUARTER</th>
                                )}
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th width={`25%`} className="fw-bolder"></th>
                                <th width={`15%`} className="fw-bolder text-center">1st</th>
                                <th width={`15%`} className="fw-bolder text-center">2nd</th>
                                <th width={`15%`} className="fw-bolder text-center">3rd</th>
                                <th width={`15%`} className="fw-bolder text-center">4th</th>
                                <th width={`10%`} className="fw-bolder text-center">Final</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th className="fw-bolder h4" colSpan={8}>MALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && Array(10).fill().map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={8}><Skeleton variant="rect" height={`20px`}/></td>
                                </tr>
                            ))}
                            {!fetching && maleStudents.length == 0 && (
                                <tr>
                                    <td className="fw-normal h4" colSpan={8}>NO STUDENTS</td>
                                </tr>
                            )}
                            {!fetching && maleStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="text-uppercase fw-bold" style={{verticalAlign: 'middle'}}>{`${student?.last_name}, ${student?.first_name}`}</td>
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
                                </tr>
                            ))}
                        </tbody>
                        <thead>
                            <tr>
                                <th className="fw-bolder h4" colSpan={8}>FEMALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && Array(10).fill().map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={8}><Skeleton variant="rect" height={`20px`}/></td>
                                </tr>
                            ))}
                            {!fetching && femaleStudents.length == 0 && (
                                <tr>
                                    <td className="fw-normal h4" colSpan={8}>NO STUDENTS</td>
                                </tr>
                            )}
                            {!fetching && femaleStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="text-uppercase fw-bold" style={{verticalAlign: 'middle'}}>{`${student?.last_name}, ${student?.first_name}`}</td>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};