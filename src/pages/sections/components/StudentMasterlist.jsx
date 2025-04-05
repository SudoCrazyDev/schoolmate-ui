import { Button, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import JHSCoc from "../../classAdvisory/components/JHSCoc";
import SHSDiploma from "../../classAdvisory/components/SHSDiploma";

export default function StudentMasterList(){
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
                                    <th className="fw-bold h3" colSpan={8}>MALE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!fetching && maleStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-normal text-uppercase">{student.last_name}, {student.first_name}</td>
                                        <td>
                                            <JHSCoc advisory={advisory} student={student}/>
                                            <SHSDiploma advisory={advisory} student={student}/>
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
                                        <td>
                                            <JHSCoc advisory={advisory} student={student}/>
                                            <SHSDiploma advisory={advisory} student={student}/>
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