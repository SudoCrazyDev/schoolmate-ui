import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ClassAdvisorySummary(){
    const { advisory_id } = useParams();
    const [femaleStudents, setFemaleStudents] = useState([]);
    const [maleStudents, setMaleStudents] = useState([]);
    const [advisory, setAdvisory] = useState(null);
    const handleFetchAdvisoryDetails = async () => {
        await axios.get(`institution_sections/${advisory_id}`)
        .then((res) => {
            let fetched_students = res.data.students || [];
            let male_students = fetched_students?.filter(student => student.gender === 'male');
            let female_students = fetched_students?.filter(student => student.gender === 'female');
            setMaleStudents(male_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setFemaleStudents(female_students.sort((a,b) => a.last_name.localeCompare(b.last_name)));
            setAdvisory(res.data);
        });
    };
    
    useEffect(() => {
        handleFetchAdvisoryDetails();
    }, [advisory_id]);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body d-flex flex-row">
                        <h2 className="m-0 fw-bolder">{advisory && `${advisory?.grade_level} - ${advisory?.title}`}</h2>
                        <div className="ms-auto gap-2 d-flex flex-row align-items-center">
                            <NavLink to={`/advisory/core-values/${advisory_id}`}>
                                <button className="btn btn-primary fw-bolder">
                                    Core Values
                                </button>
                            </NavLink>
                            <NavLink to={`/advisory-grades/${advisory_id}`}>
                                <button className="btn btn-primary fw-bold">
                                    Grades
                                </button>
                            </NavLink>
                            {/* <NavLink to={`/dashboard`}>
                                <button className="btn btn-primary fw-bold">
                                    SUBJECTS
                                </button>
                            </NavLink> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2 d-flex flex-row justify-content-between">
                <div className="col-3 p-1">
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{maleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>MALE</h1>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1">
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{femaleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>FEMALE</h1>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1">
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <h1 className="m-0 display-1 fw-bolder">{femaleStudents.length + maleStudents.length}</h1>
                            </div>
                            <h1 className='m-0 fw-bolder'>TOTAL</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex flex-row justify-content-center">
                <div className="col-8 p-2">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="m-0 fw-bolder">CLASS SCHEDULE</h5>
                            <hr />
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>SUBJECT</th>
                                        <th>TEACHER</th>
                                        <th>SCHEDULE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {advisory?.subjects?.map((subject) => (
                                        <tr key={subject.id}>
                                            <td className='text-capitalize fw-bold'>{subject.title}</td>
                                            <td className='text-capitalize fw-bold'>{subject.subject_teacher?.first_name} {subject.subject_teacher?.last_name}</td>
                                            <td className='text-capitalize fw-bold'>{subject.start_time} - {subject.end_time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-4 p-2">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="m-0 fw-bolder">NOTIFICATIONS</h5>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}