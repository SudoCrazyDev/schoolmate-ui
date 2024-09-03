import { NavLink } from "react-router-dom";
import { GetActiveInstitution, userHasRole } from "../../global/Helpers";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { useSelector } from 'react-redux';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import GroupsIcon from '@mui/icons-material/Groups';
import { useEffect, useState } from "react";
import pb from "../../global/pb";

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
    const user = useSelector(state => state.user);
    const {id} = GetActiveInstitution();
    const [advisory, setAdvisory] = useState(null);
    const [asignatories, setAsignatories] = useState([]);
    
    const handleCheckAdvisory = async() => {
        try {
            const records = await pb.collection("institution_sections").getFullList({
                filter: `class_adviser="${user.info.id}"`
            });
            setAdvisory(records);
        } catch (error) {
            
        }
    };
    
    const handleAsignatories = async() => {
        try {
            const personal = await pb.collection("user_relationships").getFullList({
                filter: `personal_info="${user.info.id}"`
            });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const subjects = await pb.collection("section_subjects")
            .getFullList({
                filter: `assigned_teacher="${personal[0].id}"`,
                expand: `section`
            })
            setAsignatories(subjects);
        } catch (error) {
            
        }
    };
    
    useEffect(() => {
        handleCheckAdvisory();
        handleAsignatories();
    }, []);
    
    return(
        <div className="d-flex flex-column bg-dark text-white col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
                
                <div className="d-flex flex-row justify-content-center p-2">
                    <h3 className="m-0 fw-bolder text-center text-capitalize">
                        Hi, {user?.info?.first_name}
                    </h3>
                </div>

                {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-column p-2">
                        <p className="fw-bolder m-0">CLASS MANAGEMENT</p>
                        <div className="d-flex flex-row p-2">
                            <NavLink to="/sections" className="h6 fw-light" style={{textDecoration: 'none'}}>
                                <div className="d-flex flex-row align-items-center">
                                    <BookmarksIcon />
                                    <p className="p-1 m-0 text-center">SECTIONS</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                )}
                
                {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-column p-2">
                        <p className="fw-bolder m-0">HUMAN RESOURCE</p>
                        <div className="d-flex flex-row p-2">
                            <NavLink to="/staffs" className="h6 fw-light" style={{textDecoration: 'none'}}>
                                <div className="d-flex flex-row align-items-center">
                                    <GroupsIcon />
                                    <p className="p-1 m-0 text-center">STAFFS</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                )}
                
                {userHasRole(dashboardAccess) && (
                    <div className="d-flex flex-row m-1 p-1 align-items-center">
                        <NavLink to="/dashboard" className="h6" style={{textDecoration: 'none'}}>
                            <SpaceDashboardIcon /> Dashboard
                        </NavLink>
                    </div>
                )}

                {userHasRole(schoolAdminAccess) || userHasRole(['Subject Teacher']) && advisory && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/advisory" className="h6" style={{textDecoration: 'none'}}>
                            Class Advisory
                        </NavLink>
                    </div>
                )}

                <div className="d-flex flex-column p-2">
                    <p className="fw-bolder m-0">ASSIGNATORIES</p>
                    {asignatories.map((assignatory, i) => (
                        <div key={assignatory.id} className="d-flex flex-row p-2">
                            <NavLink to={`/assignatory/${assignatory.id}`} className="fw-light text-white" style={{textDecoration: 'none'}}>
                                <div className="d-flex flex-row align-items-center">
                                    <p className="p-1 m-0 text-center">{assignatory?.expand?.section?.title} - {`(${assignatory?.title})`}</p>
                                </div>
                            </NavLink>
                        </div>
                    ))}
                </div>
                
                {userHasRole(schoolAdminAccess) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections/grading" className="h6" style={{textDecoration: 'none'}}>
                            Subject Assignation
                        </NavLink>
                    </div>
                )}

                {/* {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/sections/visualizer" className="h6 fw-light" style={{textDecoration: 'none'}}>
                            SCHEDULE VISUALIZER
                        </NavLink>
                    </div>
                )}
                
                {userHasRole(schoolAdminAccess) || userHasRole(['Principal']) && (
                    <div className="d-flex flex-row m-1 p-1">
                        <NavLink to="/staffs" className="h6 fw-light" style={{textDecoration: 'none'}}>
                            STAFFS
                        </NavLink>
                    </div>
                )} */}

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