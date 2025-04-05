import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buildStudentName } from "../../global/Helpers";

export default function COCChecker(){
    const { student_id } = useParams();
    const [fetch, setFetch] = useState(false);
    const [student, setStudent] = useState(null);
    
    const handleFetchStudent = async () => {
        setFetch(true);
        await axios.get(`students/info/${student_id}`)
        .then((res) => {
            setStudent(res.data.data);
        })
        .catch(() => {
            setStudent(null);
        })
        .finally(() => {
            setFetch(false);
        });
    };
    
    useEffect(() => {
        if(student_id){
            handleFetchStudent();
        }
    }, [student_id]);
    
    return (
        <div className="d-flex flex-column w-100 align-items-center justify-content-center" style={{height: "100vh"}}>
            <h1>
                {fetch ? "Loading..." : student ? `COC BELONGS TO:` : "INVALID COC!"}
            </h1>
            <h2 className="display-1 fw-bolder">
                {fetch ? "Loading..." : student ? buildStudentName(student) : "Student Not Found"}
            </h2>
            <h3 className="display-3 fw-bolder fst-italic">
                {fetch ? "Loading..." : student ? `LRN: ${student.lrn}` : "Student Not Found"}
            </h3>
        </div>
    );
};