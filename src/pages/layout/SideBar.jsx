import { userHasRole } from "../../global/Helpers";
import { useSelector } from 'react-redux';
import GroupsIcon from '@mui/icons-material/Groups';
import { Fragment, useEffect, useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from "axios";
import MenuTitle from "./components/MenuTitle";
import Menu from "./components/Menu";
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Account from "./components/Account";
import AssessmentIcon from '@mui/icons-material/Assessment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';

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
        <div className="sidebar d-flex flex-column col-2" style={{position: 'fixed'}}>
            <div className="d-flex flex-column" style={{minHeight: '100vh', maxHeight: '100vh', overflowY: 'scroll'}}>
                
                <div className="d-flex flex-row justify-content-center p-2">
                    <h3 className="m-0 fw-bolder text-center text-capitalize">
                        Hi, {user?.info?.first_name}
                    </h3>
                </div>

                {/* START ADMIN ROUTES */}
                {userHasRole(['app-admin']) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            APP MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/institutions`}
                            icon={<ApartmentIcon fontSize="inherit"/>}
                            title={`Institutions`}
                        />
                        <MenuTitle>
                            USER MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/users`}
                            icon={<GroupsIcon fontSize="inherit"/>}
                            title={`Users`}
                        />
                        <Menu
                            link={`/roles`}
                            icon={<AdminPanelSettingsIcon fontSize="inherit"/>}
                            title={`Roles`}
                        />
                    </div>
                )}
                {/* END ADMIN ROUTES */}
                {userHasRole(['principal', 'institution-app-admin', 'curriculum-heads']) && (
                    <>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            CLASS MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/sections`}
                            icon={<HomeIcon fontSize="inherit"/>}
                            title={`SECTIONS`}
                        />
                        <Menu
                            link={`/teacher-loads`}
                            icon={<AccessTimeIcon fontSize="inherit"/>}
                            title={`TEACHER LOADS`}
                        />
                    </div>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            ATTENDANCE MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/institution-school-days`}
                            icon={<SchoolIcon fontSize="inherit"/>}
                            title={`SCHOOL DAYS`}
                        />
                    </div>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            CARD TEMPLATES
                        </MenuTitle>
                        <Menu
                            link={`/card-templates`}
                            icon={<DescriptionIcon fontSize="inherit"/>}
                            title={`CARD TEMPLATES`}
                        />
                    </div>
                    </>
                    
                )}

                <div className="d-flex flex-column p-2">
                    <MenuTitle>
                        GRADES MANAGEMENT
                    </MenuTitle>
                    <Menu
                        link={`/grades-consolidation`}
                        icon={<AssessmentIcon fontSize="inherit"/>}
                        title={`CONSOLIDATED GRADES`}
                    />
                </div>
                    
                {userHasRole(['principal', 'institution-app-admin']) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            GRADES MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/grades-access-management`}
                            icon={<KeyIcon fontSize="inherit"/>}
                            title={`ACCESS`}
                        />
                    </div>
                )}
                
                {userHasRole(['principal', 'institution-app-admin']) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            REPORTS
                        </MenuTitle>
                        <Menu
                            link={`/gpa`}
                            icon={<LeaderboardIcon fontSize="inherit"/>}
                            title={`GPA`}
                        />
                    </div>
                )}
                
                {userHasRole(['principal', 'institution-app-admin', 'curriculum-heads']) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            HRIS
                        </MenuTitle>
                        <Menu
                            link={`/staffs`}
                            icon={<GroupsIcon fontSize="inherit"/>}
                            title={`STAFFS`}
                        />
                    </div>
                )}
                
                {advisory?.length > 0 && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            CLASS ADVISORY
                        </MenuTitle>
                        {advisory.length > 0 && advisory.map((advisory, index) => (
                            <Menu
                                key={advisory.id}
                                link={`/advisory-summary/${advisory.id}`}
                                icon={<CastForEducationIcon fontSize="inherit"/>}
                                title={`${advisory.grade_level} - ${advisory.title}`}
                            />
                        ))}
                    </div>
                )}
                
                {asignatories?.length > 0 && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            ASSIGNED LOADS
                        </MenuTitle>
                        {asignatories.length > 0 && asignatories.map((load, index) => (
                            <Fragment key={load.id}>
                            {!load.parent_subject && (
                                <Menu
                                    key={load.id}
                                    link={`/grading/${load.id}`}
                                    icon={<CastForEducationIcon fontSize="inherit"/>}
                                    title={`${load.section?.grade_level} - ${load.section?.title}: ${load.title}`}
                                />
                            )}
                            </Fragment>
                        ))}
                    </div>
                )}
                
                <div className="mt-auto pt-3">
                    <Account />
                </div>
            </div>
        </div>
    );
}