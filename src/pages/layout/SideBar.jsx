import { NavLink } from "react-router-dom";
import { userHasRole } from "../../global/Helpers";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const adminAccess = [
    'administrator'
];

const dashboardAccess = [
    'administrator',
    'subject-teacher'
];
const sectionsAccess = [
    'administrator',
    'curriculum-head-7',
    'curriculum-head-8',
    'curriculum-head-9',
    'curriculum-head-10',
    'curriculum-head-11',
    'curriculum-head-12',
];
const teachersAccess = [
    'administrator',
    'curriculum-head-7',
    'curriculum-head-8',
    'curriculum-head-9',
    'curriculum-head-10',
    'curriculum-head-11',
    'curriculum-head-12',
];

export default function SideBar(){
    
    return(
        <div className="d-flex flex-column bg-dark text-white col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
                <div className="d-flex flex-row justify-content-center p-2">
                    <h1 className="m-0">GSCNSSAT</h1>
                </div>
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1 align-items-center">
                        <NavLink to="/dashboard" className="h6" style={{textDecoration: 'none'}}>
                            <SpaceDashboardIcon /> Dashboard
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/advisory" className="h6" style={{textDecoration: 'none'}}>
                            Class Advisory
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections/grading" className="h6" style={{textDecoration: 'none'}}>
                            Subject Assignation
                        </NavLink>
                    </div>
                )}
                
                
                {userHasRole(sectionsAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections" className="h6" style={{textDecoration: 'none'}}>
                            Sections
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(adminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/teachers" className="h6" style={{textDecoration: 'none'}}>
                            Teachers
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(adminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/curriculum-heads" className="h6" style={{textDecoration: 'none'}}>
                            Curriculum Heads
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