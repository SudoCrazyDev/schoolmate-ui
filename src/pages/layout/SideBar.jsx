import { NavLink } from "react-router-dom";
import { GetActiveInstitution, userHasRole } from "../../global/Helpers";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { useSelector } from 'react-redux';
import GroupsIcon from '@mui/icons-material/Groups';
import { useEffect, useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from "axios";

export default function SideBar(){
    const user = useSelector(state => state.user);
    const {info} = useSelector(state => state.user);
    const [advisory, setAdvisory] = useState(null);
    const [asignatories, setAsignatories] = useState([]);
    
    const handleCheckAdvisory = async() => {
        await axios.get(`institution_sections/get_by_user/${info.id}`)
        .then((res) => {
            setAdvisory(res.data);
        });
    };
    
    const handleTeacherLoads = async () => {
        await axios.get(`subjects/by_user/${info.id}`)
        .then((res) => {
            setAsignatories(res.data);
        });
    };
    
    useEffect(() => {
        handleCheckAdvisory();
        handleTeacherLoads();
    }, []);
    
    return(
        <div className="d-flex flex-column bg-dark text-white col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh', maxHeight: '100vh', overflowY: 'scroll'}}>
                
                <div className="d-flex flex-row justify-content-center p-2">
                    <h3 className="m-0 fw-bolder text-center text-capitalize">
                        Hi, {user?.info?.first_name}
                    </h3>
                </div>

                {/* START ADMIN ROUTES */}
                {userHasRole(['app-admin']) && (
                    <div className="d-flex flex-column p-2">
                        
                        <p className="ps-2 fw-bolder m-0">APP MANAGEMENT</p>
                        
                        <div className="d-flex flex-row m-1 p-1">
                            <NavLink to="/institutions" className="h6" style={{textDecoration: 'none'}}>
                                Institutions
                            </NavLink>
                        </div>
                        
                        <p className="ps-2 fw-bolder m-0">USER MANAGEMENT</p>
                        
                        <div className="d-flex flex-row m-1 p-1">
                            <NavLink to="/users" className="h6" style={{textDecoration: 'none'}}>
                                Users
                            </NavLink>
                        </div>
                        
                        <div className="d-flex flex-row m-1 p-1">
                            <NavLink to="/roles" className="h6" style={{textDecoration: 'none'}}>
                                Roles
                            </NavLink>
                        </div>
                        
                        <div className="d-flex flex-row m-1 p-1">
                            <NavLink to="/permissions" className="h6" style={{textDecoration: 'none'}}>
                                Permissions
                            </NavLink>
                        </div>
                        
                    </div>
                )}
                {/* END ADMIN ROUTES */}
                {userHasRole(['principal', 'institution-app-admin', 'curriculum-heads']) && (
                    <div className="d-flex flex-column p-2">
                        <p className="ps-2 fw-bolder m-0">CLASS MANAGEMENT</p>
                        
                        <NavLink to="/sections" className="ps-3 h6 fw-light" style={{textDecoration: 'none'}}>
                            <div className="d-flex flex-row align-items-center">
                                <HomeIcon />
                                <p className="p-1 pb-0 m-0 text-center">Sections</p>
                            </div>
                        </NavLink>

                        <NavLink to="/teacher-loads" className="ps-3 h6 fw-light" style={{textDecoration: 'none'}}>
                            <div className="d-flex flex-row align-items-center">
                                <AccessTimeIcon />
                                <p className="p-1 pb-0  m-0 text-center">Teacher Loads</p>
                            </div>
                        </NavLink>
                    </div>
                )}

                {userHasRole(['principal', 'institution-app-admin']) && (
                    <div className="d-flex flex-column p-2">

                        <p className="ps-2 mt-3 fw-bolder m-0">GRADES MANAGEMENT</p>

                        <NavLink to="/grades-access-management" className="ps-3 h6 fw-light" style={{textDecoration: 'none'}}>
                            <div className="d-flex flex-row align-items-center">
                                <KeyIcon />
                                <p className="p-1 pb-0  m-0 text-center">ACCESS</p>
                            </div>
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(['principal', 'institution-app-admin', 'curriculum-heads']) && (
                    <div className="d-flex flex-column p-2">
                        <p className="ps-2 mt-3 fw-bolder m-0">HRIS</p>
                        <div className="d-flex flex-row p-2">
                            <NavLink to="/staffs" className="h6 fw-light" style={{textDecoration: 'none'}}>
                                <div className="d-flex flex-row align-items-center">
                                    <GroupsIcon />
                                    <p className="p-1 pb-0  m-0 text-center">STAFFS</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                )}
                
                {advisory?.length > 0 && (
                    <div className="d-flex flex-column p-2">
                        <p className="ps-2 mt-3 fw-bolder m-0">CLASS ADVISORY</p>
                        {advisory.length > 0 && advisory.map((advisory, index) => (
                            <div key={advisory.id} className="d-flex flex-row m-1 p-1">
                                <NavLink to={`/advisory-summary/${advisory.id}`} className="h6" style={{textDecoration: 'none'}}>
                                   {`${advisory.grade_level} - ${advisory.title}`}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                )}
                
                {asignatories?.length > 0 && (
                    <div className="d-flex flex-column p-2">
                        <p className="ps-2 mt-3 fw-bolder m-0">ASSIGNED LOADS</p>
                        {asignatories.length > 0 && asignatories.map((load, index) => (
                            <div key={load.id} className="d-flex flex-row m-1 p-1">
                                <NavLink to={`/grading/${load.id}`} className="h6" style={{textDecoration: 'none'}}>
                                {`${load.section?.grade_level} - ${load.section?.title}: ${load.title}`}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                )}
                

                <div className="mt-auto py-3">
                    <div className="d-flex flex-row m-1 p-1">
                        <h6 className="m-0">Account</h6>
                    </div>
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/logout" className="h6">
                            Logout
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}