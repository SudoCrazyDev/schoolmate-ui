import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Axios from "axios";

const dashboardAccess = [
    'administrator',
    'subject-teacher'
];
const sectionsAccess = [
    'administrator',
    'curriculum-head'
];

export default function SideBar(){
    const token = useSelector(state => state.user.token);
    const [role, setRole] = useState([]);
    
    const handleFetchAdvisoryStudents = () => {
        Axios.get(`user/role/${token}`)
        .then(({data}) => {
            setRole(data.roles);
        });
    };
    
    useEffect(() => {
        handleFetchAdvisoryStudents();
    },[]);
    
    return(
        <div className="d-flex flex-column bg-dark text-white" style={{minHeight: '100%', maxHeight: '100vh', position: 'sticky'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
                <div className="d-flex flex-row justify-content-center p-2">
                    <h1 className="m-0">GSCNSSAT</h1>
                </div>
                {role && role[0] && dashboardAccess.includes(role[0].name) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/dashboard" className="h6">
                            Dashboard
                        </NavLink>
                    </div>
                )}
                
                {/* <div className="d-flex flex-row m-1 p-1">
                    <h6 className="m-0">Class Advisory</h6>
                </div>
                
                <div className="d-flex flex-row m-1 p-1">
                    <NavLink to="/sections/grading" className="h6">
                        Subject Assignation
                    </NavLink>
                </div> */}
                
                {role && role[0] && sectionsAccess.includes(role[0].name) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections" className="h6">
                            Sections
                        </NavLink>
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