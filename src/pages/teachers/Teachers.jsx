import { useEffect, useMemo, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import AddTeacher from './partials/AddTeacher';
import TextField from '@mui/material/TextField';
import EditTeacher from './partials/EditTeacher';
import pb from '../../global/pb';
import ChangeRoleModal from './partials/ChangeRole';
import { useAlert } from '../../hooks/CustomHooks';
import { GetActiveInstitution, sortStaff } from '../../global/Helpers';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import UpdateTeacherEmployment from './partials/UpdateTeacherEmployment';

export default function Teachers(){
    const [keyword, setKeyword] = useState("");
    const [fetching, setFetching] = useState(false);
    const {institutions} = useSelector(state => state.user);
    const [staffs, setStaffs] = useState([]);

    const handleFetchTeachers = async () => {
        setFetching(true);
        await axios.get(`users/all_by_institutions/${institutions[0].id}`)
        .then(res => {
            let fetched_staffs = res.data.data;
            setStaffs(sortStaff(fetched_staffs));
        })
        .finally(() => {
            setFetching(false);
        });
    };

    const filteredStaffs = useMemo(() => {
        if(keyword === '') return staffs;
        return staffs.filter(staff => String(Object.values(staff).join("").replaceAll(" ", "").toLowerCase()).includes(String(keyword).toLowerCase()));
    }, [staffs, keyword]);

    useEffect(() => {
        handleFetchTeachers();
    }, []);

    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">SCHOOL STAFFS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update staff information.</p>
                    </div>
                    <div className="ms-auto">
                        <AddTeacher refreshTeachers={handleFetchTeachers}/>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row gap-2">
                            <TextField id='search_input' size='small' label="Search" variant="outlined" onChange={(e) => setKeyword(e.target.value.toLowerCase())}/>
                        </div>
                        <div className="d-flex flex-column mb-1">
                            <hr />
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='fw-bold'>Teacher</th>
                                    <th className='fw-bold'>Email</th>
                                    <th className='fw-bold'>Role</th>
                                    <th className='fw-bold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching && Array(10).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={4}>
                                            <Skeleton variant='rect' height={'30px'} />
                                        </td>
                                    </tr>
                                ))}
                                {!fetching && filteredStaffs.map((staff) => (
                                    <tr key={staff.id}>
                                        <td className='fw-bolder text-uppercase'>{staff.last_name}, {staff.first_name}</td>
                                        <td>{staff.email}</td>
                                        <td>{staff.roles[0].title}</td>
                                        <td>
                                            <EditTeacher teacher={staff} refresh={handleFetchTeachers}/>
                                            <UpdateTeacherEmployment teacher={staff} refresh={handleFetchTeachers}/>
                                            <ChangeRoleModal teacher={staff} refresh={handleFetchTeachers}/>
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