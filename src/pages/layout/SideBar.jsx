import { NavLink } from "react-router-dom";
import { GetActiveInstitution, userHasRole } from "../../global/Helpers";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const adminAccess = [
    'Super Administrator'
];

const schoolAdminAccess = [
    'School Principal',
    'School Admin',
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
    const institution = GetActiveInstitution();
    return(
        <div className="d-flex flex-column bg-dark text-white col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
                <div className="d-flex flex-row justify-content-center p-2">
                    <h1 className="m-0 fw-bolder" style={{letterSpacing: '4px'}}>{institution.abbr ? institution.abbr: 'ABCD'}</h1>
                </div>

                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1 align-items-center">
                        <NavLink to="/dashboard" className="h6" style={{textDecoration: 'none'}}>
                            <SpaceDashboardIcon /> Dashboard
                        </NavLink>
                    </div>
                )}

                {userHasRole(schoolAdminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/advisory" className="h6" style={{textDecoration: 'none'}}>
                            Class Advisory
                        </NavLink>
                    </div>
                )}

                {userHasRole(schoolAdminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections/grading" className="h6" style={{textDecoration: 'none'}}>
                            Subject Assignation
                        </NavLink>
                    </div>
                )}

                <div className="d-flex flex-row m-1 p-1">
                    <p className="m-0 fw-bolder" style={{letterSpacing: '1px'}}>
                        SCHEDULING
                    </p>
                </div>
                {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections" className="h6 fw-light" style={{textDecoration: 'none'}}>
                            SECTIONS
                        </NavLink>
                    </div>
                )}

                <div className="d-flex flex-row m-1 p-1">
                    <p className="m-0 fw-bolder" style={{letterSpacing: '1px'}}>
                        HRIS
                    </p>
                </div>
                
                {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/staffs" className="h6 fw-light" style={{textDecoration: 'none'}}>
                            STAFFS
                        </NavLink>
                    </div>
                )}

                {userHasRole(schoolAdminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/curriculum-heads" className="h6" style={{textDecoration: 'none'}}>
                            Curriculum Heads
                        </NavLink>
                    </div>
                )}

                {userHasRole(adminAccess) || userHasRole(['App Admin']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/institutions" className="h6" style={{textDecoration: 'none'}}>
                            Institutions
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(adminAccess) || userHasRole(['App Admin']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/users" className="h6" style={{textDecoration: 'none'}}>
                            Users
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