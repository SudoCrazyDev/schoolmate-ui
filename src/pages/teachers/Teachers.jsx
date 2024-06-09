import { useEffect, useMemo, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import AddTeacher from './partials/AddTeacher';
import TextField from '@mui/material/TextField';
import EditTeacher from './partials/EditTeacher';
import pb from '../../global/pb';
import ChangeRoleModal from './partials/ChangeRole';
import Skeleton from '@mui/material/Skeleton';
import { useAlert } from '../../hooks/CustomHooks';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { GetActiveInstitution } from '../../global/Helpers';

const intialState = {
    selected_teacher: null,
    change_role_modal_state: false
};

const actionTypes = {
    UPDATE_MODAL_STATE: "UPDATE_MODAL_STATE",
    SELECT_TEACHER: "SELECT TEACHER"
};

const actions = {
    UPDATE_MODAL_STATE: (value) => ({type: actionTypes.UPDATE_MODAL_STATE, payload: value}),
    SELECT_TEACHER: (value) => ({type: actionTypes.SELECT_TEACHER, payload: value})
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_MODAL_STATE:
            return {...state, change_role_modal_state: action.payload}
        case actionTypes.SELECT_TEACHER:
            return {...state, selected_teacher: action.payload}
        default:
            return state;
    }
};

export default function Teachers(){
    const [teachers, setTeachers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [filterFieldOption, setFilterFieldOption] = useState("first_name");
    const [state, dispatch] = useReducer(reducer, intialState);
    const [fetching, setFetching] = useState(false);
    const {id} = GetActiveInstitution();
    const alert = useAlert();
    
    const handleFetchTeachers = async () => {
        setFetching(true);
        try {
            const records = await pb.collection("user_relationships")
            .getList(1, 10, {
                expand: 'user,personal_info,roles',
                filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd"`
            })
            setTeachers(records.items);
        } catch (error) {
            alert.setAlert('error', "Failed to load Teachers.")
        } finally {
            setFetching(false);
        }
    };
    
    const handleSearchTeacher = async () => {
        if(keyword == ""){
            alert.setAlert("error", "Missing search value");
            return ;
        }
        try {
            setFetching(true);
            const filterField = filterFieldOption === 'email' ? `user.${filterFieldOption}` : `personal_info.${filterFieldOption}`;
            const records = await pb.collection("user_relationships")
                .getList(1, 50, {
                    expand: 'user,personal_info,roles',
                    filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd" && ${filterField}~"${keyword}"`
                });
            setTeachers(records.items);
        } catch (error) {
            alert.setAlert("error", "Search Failed");
        } finally {
            setFetching(false);
        }
    };
    
    const handleChangeRole = (teacher) => {
        dispatch(actions.UPDATE_MODAL_STATE(true));
        dispatch(actions.SELECT_TEACHER(teacher));
    };
    
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
                            <div className="col-3">
                                <select placeholder="Search by:" className='form-select' value={filterFieldOption} onChange={(e) => setFilterFieldOption(e.target.value)}>
                                    <option disabled>Search by:</option>
                                    <option value={`first_name`}>First Name</option>
                                    <option value={`last_name`}>Last Name</option>
                                    <option value={`email`}>Email</option>
                                </select>
                            </div>
                            <div className="d-flex flex-column">
                                <button className="btn btn-primary" onClick={() => handleSearchTeacher()} disabled={fetching}>
                                    {fetching ? <div className='spinner-border spinner-border-sm'></div> : "Search"}
                                </button>
                            </div>
                            
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
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td className='fw-bolder text-uppercase'>{teacher.expand.personal_info.last_name}, {teacher.expand.personal_info.first_name}</td>
                                        <td>{teacher.expand.user.email}</td>
                                        <td>{teacher.expand.roles[0].title}</td>
                                        <td>
                                            <IconButton onClick={() => handleChangeRole(teacher)} color='primary'>
                                                <AccessibilityIcon fontSize='small' />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ChangeRoleModal reducer={{state, dispatch, actions}} refresh={handleFetchTeachers}/>
        </div>
    );
};