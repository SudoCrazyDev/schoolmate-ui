import { IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const QuarterCard = ({index, accessQuarters, handleUpdateAccess, locking}) => {
    return(
        <div className="col-3 p-2">
            <div className="card">
                <div className="card-body d-flex flex-column align-items-center gap-2">
                    <h3 className="m-0 fw-bold">Quarter {index + 1}</h3>
                    {index === 0 && accessQuarters[0].quarter_one === 0 && (
                        <button className="btn w-100 btn-secondary fw-bold" onClick={() => handleUpdateAccess(1)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            UNLOCK
                        </button>
                    )}
                    {index === 0 && accessQuarters[0].quarter_one === 1 && (
                        <button className="btn w-100 btn-primary fw-bold" onClick={() => handleUpdateAccess(1)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            LOCK
                        </button>
                    )}
                    {index === 1 && accessQuarters[0].quarter_two === 0 && (
                        <button className="btn w-100 btn-secondary fw-bold" onClick={() => handleUpdateAccess(2)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            UNLOCK
                        </button>
                    )}
                    {index === 1 && accessQuarters[0].quarter_two === 1 && (
                        <button className="btn w-100 btn-primary fw-bold" onClick={() => handleUpdateAccess(2)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            LOCK
                        </button>
                    )}
                    {index === 2 && accessQuarters[0].quarter_three === 0 && (
                        <button className="btn w-100 btn-secondary fw-bold" onClick={() => handleUpdateAccess(3)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            UNLOCK
                        </button>
                    )}
                    {index === 2 && accessQuarters[0].quarter_three === 1 && (
                        <button className="btn w-100 btn-primary fw-bold" onClick={() => handleUpdateAccess(3)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            LOCK
                        </button>
                    )}
                    {index === 3 && accessQuarters[0].quarter_four === 0 && (
                        <button className="btn w-100 btn-secondary fw-bold" onClick={() => handleUpdateAccess(4)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            UNLOCK
                        </button>
                    )}
                    {index === 3 && accessQuarters[0].quarter_four === 1 && (
                        <button className="btn w-100 btn-primary fw-bold" onClick={() => handleUpdateAccess(4)}>
                            {locking && <span className="spinner-border spinner-border-sm me-2"></span>}
                            LOCK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function AccessManagement(){
    const { institutions } = useSelector(state => state.user);
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [accessQuarters, setQuartersAccess] = useState([]);
    const [locking, setLocking] = useState(false);
    
    const handleFetchGradingAccess = async () => {
        await axios.get(`meta/grade_access/${institutions[0].id}`)
        .then((res) => {
            setQuartersAccess(res.data.data);
        });
    };
    
    const handleUpdateAccess = async (quarter) => {
        setLocking(true);
        const data = {
            quarter_one: quarter === 1 ? !accessQuarters[0].quarter_one : accessQuarters[0].quarter_one,
            quarter_two: quarter === 2 ? !accessQuarters[0].quarter_two : accessQuarters[0].quarter_two,
            quarter_three: quarter === 3 ? !accessQuarters[0].quarter_three : accessQuarters[0].quarter_three,
            quarter_four: quarter === 4 ? !accessQuarters[0].quarter_four : accessQuarters[0].quarter_four,
        };
        await axios.put(`meta/update_grading_access/${institutions[0].id}`, data)
        .then((res) => {
            handleFetchGradingAccess();
        })
        .finally(() => {
            setLocking(false);
        });
    };
    
    const handleFetchTeachers = async () => {
        setFetching(true);
        await axios.get(`users/all_users/${institutions[0].id}`)
        .then((res) => {
            let fetched = res.data.data.data;
            setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    const filteredTeachers = useMemo(() => {
        if(keyword === '') return teachers;
        return teachers.filter(teacher => String(String(teacher.first_name).toLowerCase()).concat(String(teacher.last_name).toLowerCase()).includes(keyword.toLowerCase()));
    }, [teachers, keyword]);
    
    useEffect(() => {
        handleFetchTeachers();
        handleFetchGradingAccess();
    }, []);
    
    return(
        <div className="d-flex flex-column gap-3">
            <div className="card">
                <div className="card-body d-flex flex-row">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bold">Grades Access Management</h2>
                        <p className="m-0">Give permanent or temporary access to users.</p>
                    </div>
                    <div className="ms-auto">
                        
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row">
                {accessQuarters.length > 0 && Array(4).fill().map((_,i) => (
                    <QuarterCard key={i} index={i} accessQuarters={accessQuarters} handleUpdateAccess={handleUpdateAccess} locking={locking}/>
                ))}
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column gap-3">
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="form-control" placeholder="Search Teacher"/>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>TEACHER</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && Array(5).fill().map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={2}><Skeleton variant="rect" height={`30px`}/></td>
                                </tr>
                            ))}
                            {!fetching && filteredTeachers.map((teacher, index) => (
                                <tr key={teacher.id}>
                                    <td className="fw-bold text-uppercase">{teacher.last_name}, {teacher.first_name}</td>
                                    <td>
                                        <Tooltip title={'View Loads'}>
                                            <NavLink to={`${teacher.id}`}>
                                                <IconButton color="primary" size="small">
                                                    <OpenInNewIcon fontSize="small"/>
                                                </IconButton>
                                            </NavLink>
                                        </Tooltip>
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