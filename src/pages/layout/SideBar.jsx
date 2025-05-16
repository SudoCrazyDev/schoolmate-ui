import { CheckSubscriptionAccess, userHasRole } from "../../global/Helpers";
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
import EventNoteIcon from '@mui/icons-material/EventNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

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
        <div className="flex flex-col w-[100%] h-screen">
            <div className="flex flex-col h-screen overflow-y-scroll">

                <div className="flex flex-row justify-center p-2">
                    <h3 className="m-0 font-bold text-xl uppercase">
                        Hi, {user?.info?.first_name}
                    </h3>
                </div>
                        
                {/* START ADMIN ROUTES */}
                {userHasRole(['app-admin']) && (
                    <div className="flex flex-col p-2">
                        <MenuTitle>
                            APP MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/institutions`}
                            icon={<ApartmentIcon fontSize="inherit"/>}
                            title={`Institutions`}
                            allowedRole={['app-admin']}
                        />
                        <Menu
                            link={`/subscriptions`}
                            icon={<CardMembershipIcon fontSize="inherit"/>}
                            title={`Subscriptions`}
                            allowedRole={['app-admin']}
                        />
                        <MenuTitle>
                            USER MANAGEMENT
                        </MenuTitle>
                        <Menu
                            link={`/users`}
                            icon={<GroupsIcon fontSize="inherit"/>}
                            title={`Users`}
                            allowedRole={['app-admin']}
                        />
                        <Menu
                            link={`/roles`}
                            icon={<AdminPanelSettingsIcon fontSize="inherit"/>}
                            title={`Roles`}
                            allowedRole={['app-admin']}
                        />
                    </div>
                )}
                {/* END ADMIN ROUTES */}
                
                {CheckSubscriptionAccess(["standard"]) && (
                    <>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            CLASS MANAGEMENT
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads']}
                            link={`/sections`}
                            icon={<HomeIcon fontSize="inherit"/>}
                            title={`Sections`}
                        />
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads']}
                            link={`/teacher-loads`}
                            icon={<AccessTimeIcon fontSize="inherit"/>}
                            title={'Teacher Loads'}
                        />
                    </div>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            ATTENDANCE MANAGEMENT
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads']}
                            link={`/institution-school-days`}
                            icon={<SchoolIcon fontSize="inherit"/>}
                            title={`School Days`}
                        />
                    </div>
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            CARD TEMPLATES
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads']}
                            link={`/card-templates`}
                            icon={<DescriptionIcon fontSize="inherit"/>}
                            title={`Card Templates`}
                        />
                    </div>
                    </>
                )}

                {CheckSubscriptionAccess(["standard"]) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            GRADES MANAGEMENT
                        </MenuTitle>
                        <Menu
                            allowedRole={['subject-teacher', 'institution-app-admin', 'principal', 'curriculum-heads']}
                            link={`/grades-consolidation`}
                            icon={<AssessmentIcon fontSize="inherit"/>}
                            title={`Consolidated Grades`}
                        />
                    </div>
                )}

                {CheckSubscriptionAccess(["standard"]) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            GRADES MANAGEMENT
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin']}
                            link={`/grades-access-management`}
                            icon={<KeyIcon fontSize="inherit"/>}
                            title={`Access`}
                        />
                    </div>
                )}

                {CheckSubscriptionAccess(["standard"]) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            REPORTS
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin']}
                            link={`/gpa`}
                            icon={<LeaderboardIcon fontSize="inherit"/>}
                            title={`GPA`}
                        />
                    </div>
                )}

                {CheckSubscriptionAccess(["standard", "basic"]) && (
                    <div className="d-flex flex-column p-2">
                        <MenuTitle>
                            HRIS
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads', 'hris-admin']}
                            link={`/staffs`}
                            icon={<GroupsIcon fontSize="inherit"/>}
                            title={`Staff`}
                        />
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads', 'hris-admin']}
                            link={`/attendance-records`}
                            icon={<DateRangeIcon fontSize="inherit"/>}
                            title={`Attendances`}
                        />
                        <MenuTitle>
                            CONFIGURATIONS
                        </MenuTitle>
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads', 'hris-admin']}
                            link={`/timetable`}
                            icon={<EventNoteIcon fontSize="inherit"/>}
                            title={`Timetable`}
                        />
                        <Menu
                            allowedRole={['principal', 'institution-app-admin', 'curriculum-heads', 'hris-admin']}
                            link={`/academic-years`}
                            icon={<SchoolIcon fontSize="inherit"/>}
                            title={`Academic Years`}
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