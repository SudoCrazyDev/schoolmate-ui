import { useParams } from "react-router-dom";
import pb from "../../global/pb";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import ViewGrades from "./components/ViewGrades";

export default function Assignatory(){
    const {subject_id} = useParams();
    const [subject, setSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(false);
    
    const handleFetchStudents = async () => {
        setFetching(true);
        try {
            const fetched_subject = await pb.collection("section_subjects").getOne(subject_id);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const fetched_students = await pb.collection("student_base").getFullList({
                filter: `section="${fetched_subject.section}"`,
                expand: `student_personal_data_via_student`
            });
            setSubject(fetched_subject);
            setStudents(fetched_students);
            setFetching(false);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        handleFetchStudents();
    }, [subject_id]);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">{fetching ? <Skeleton variant="text" /> : subject?.title}</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update student grades.</p>
                    </div>
                    <div className="ms-auto d-flex flex-row gap-1">
                        
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th width={`40%`}>STUDENT</th>
                                <th width={`10%`}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{student?.expand?.student_personal_data_via_student?.[0].last_name}, {student?.expand?.student_personal_data_via_student?.[0].first_name}</td>
                                    <td>
                                        <ViewGrades student={student} subject={subject}/>
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