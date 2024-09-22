import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function TeacherLoads(){
    const { institutions } = useSelector(state => state.user);
    const [teachers, setTeachers] = useState([]);
    
    const handleFetchTeachers = async () => {
        await axios.get(`users/all_users/${institutions[0].id}`)
        .then((res) => {
            let fetched = res.data.data.data;
            setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        });
    };
    
    useEffect(() => {
        handleFetchTeachers();
    }, []);
    
    return(
        <div className="d-flex flex-column gap-3">
            <div className="card">
                <div className="card-body d-flex flex-row">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">TEACHER LOADS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>View or Update Teacher's Loads.</p>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column">
                    {/* <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <label>Lookup</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div> */}
                    <div className="d-flex flex-row mt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>TEACHER</th>
                                    <th>ADVISORY</th>
                                    <th>LOADS</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher.id}>
                                        <td className='fw-bold text-uppercase'>{teacher.last_name}, {teacher.first_name}</td>
                                        <td className='fw-bold'>{teacher.advisory ? `${teacher.advisory.grade_level} - ${teacher.advisory.title}` : 'NO ADVISORY'}</td>
                                        <td>{teacher.loads?.length}</td>
                                        <td>
                                            
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