import { NavLink } from "react-router-dom";
import { userHasRole } from "../../global/Helpers";

const dashboardAccess = [
    'administrator',
    'subject-teacher'
];
const sectionsAccess = [
    'administrator',
    'curriculum-head'
];
const teachersAccess = [
    'administrator',
    'curriculum-head'
];

export default function SideBar(){
    
    return(
        <div className="d-flex flex-column bg-dark text-white col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
                <div className="d-flex flex-row justify-content-center p-2">
                    <h1 className="m-0">GSCNSSAT</h1>
                </div>
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/dashboard" className="h6">
                            Dashboard
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/advisory" className="h6">
                            Class Advisory
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections/grading" className="h6">
                            Subject Assignation
                        </NavLink>
                    </div>
                )}
                
                
                {userHasRole(sectionsAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections" className="h6">
                            Sections
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(teachersAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/teachers" className="h6">
                            Teachers
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