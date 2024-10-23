import axios from "axios";
import { useEffect, useState } from "react";

export default function AdvisoryMissingGrades({advisory}){
    const [subjects, setSubjects] = useState([]);
    
    const handleFetchMissingGrades = async () => {
        await axios.get(`subjects/missing_grades/${advisory?.id}`)
        .then((res) => {
            setSubjects(res.data.data);
        })
    };
    
    const handleGetStatus = (graded) => {
        if((graded - advisory?.students.length) === 0){
            return <span class="badge text-bg-success shadow">{graded}/{advisory?.students.length}</span>;
        } else if ((graded - advisory?.students.length) < 0){
            return <span class="badge text-bg-danger shadow">{graded}/{advisory?.students.length}</span>;
        } else {
            return <span class="badge text-bg-warning shadow">{graded}/{advisory?.students.length}</span>;
        }
    };
    
    useEffect(() => {
        handleFetchMissingGrades();
    }, [advisory]);
    
    return(
        <div className="col-8 p-2">
            <div className="card shadow">
                <div className="card-body d-flex flex-column">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <h5 className="m-0 fw-bold">GRADES STATUS</h5>
                            <p className="m-0" style={{ fontSize: '12px' }}>Check how many students has grades.</p>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-border">
                        <thead>
                            <tr>
                                <th width={'40%'}>SUBJECT</th>
                                <th width={'35%'}>TEACHER</th>
                                <th width={'25%'} className="text-center">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.length == 0 && (
                                <tr>
                                    <td colSpan={3} className="fw-bolder">NO SUBJECTS FOUND</td>
                                </tr>
                            )}
                            {subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td className="fw-bolder text-uppercase">{subject.title}</td>
                                    <td className="fw-bolder text-uppercase">{subject.subject_teacher.last_name}, {subject.subject_teacher.first_name}</td>
                                    <td className="fw-bolder text-uppercase text-center">{handleGetStatus(subject.graded)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};