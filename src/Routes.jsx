import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Routes,
  } from "react-router-dom";
import Login from "./pages/auth/Login";
import Forgot from "./pages/auth/Forgot";
import NewPassword from "./pages/auth/NewPassword";
import NewUserPassword from "./pages/auth/NewUserPassword";
import PrivateRoutes from "./PrivateRoutes";
import SharedLayout from "./pages/layout/SharedLayout";
import Dashboard from "./pages/dasboard/Dashboard";
import PublicRoutes from "./PublicRoutes";
import Sections from "./pages/sections/Sections";
import QuickEnrollmentForm from "./pages/students/QuickEnrollmentForm";
import StudentsGrading from "./pages/grading/StudentsGrading";
import Logout from "./pages/auth/Logout";
import Teachers from "./pages/teachers/Teachers";
import AuthInit from "./AuthInit";
import ClassAdvisory from "./pages/classAdvisory/ClassAdvisory";
import NewStudent from "./pages/classAdvisory/partials/NewStudent";
import CurriculumHeads from "./pages/curriculumHead/CurriculumHeads";
import BulkStudent from "./pages/classAdvisory/partials/BulkAddStudent";
import InstitutionRegistration from "./pages/public/InstitutionRegistration/InstituionRegistration";
import Institutions from "./pages/institutions/Institutions";
import Users from "./pages/users/Users";
import ScheduleVisualizer from "./pages/scheduleVisualizer/ScheduleVisualizer";
import Assignatory from "./pages/assignatory/Assignatory";
import Roles from "./pages/roles/Roles";
import Permissions from "./pages/permissions/Permissions";
import NewSection from "./pages/sections/NewSection";
import TeacherLoads from "./pages/teacherLoads/TeacherLoads";
import StudentSubjectGrades from "./pages/studentSubjectGrades/StudentSubjectGrades";
import AccessManagement from "./pages/accessManagement/AccessManagement";
import ViewLoads from "./pages/accessManagement/ViewLoads";
import ClassAdvisorySummary from "./pages/classAdvisory/ClassAdvisorySummary";
import CoreValues from "./pages/classAdvisory/partials/CoreValues";
import EditStudent from "./pages/classAdvisory/partials/EditStudent,";
import ClassAdvisoryStudents from "./pages/classAdvisory/ClassAdvisoryStudents";
import ConsolidatedGrades from "./pages/consolidatedGrades/ConsolidatedGrades";
import CertificateBuilder from "./pages/certificateBuilder/CertificateBuilder";
import Gpa from "./pages/reports/gpa/Gpa";
import CardTemplates from "./pages/cardTemplates/CardTemplates";
import AdvisoryAttendance from "./pages/classAdvisory/AdvisoryAttendance";
import SchoolDays from "./pages/institutionSchoolDays/SchoolDays";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
        <Route element={<AuthInit><PrivateRoutes /></AuthInit>}>
          <Route element={<SharedLayout />} path="/">
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Sections />} path="/sections" />
            <Route element={<NewSection />} path="/sections/new-section" />
            <Route element={<ScheduleVisualizer />} path="/sections/visualizer" />
            <Route element={<StudentsGrading />} path="/sections/grading" />
            <Route element={<Teachers />} path="/staffs" />
            <Route element={<CurriculumHeads />} path="/curriculum-heads" />
            <Route element={<ClassAdvisorySummary />} path="/advisory-summary/:advisory_id" />
            <Route element={<ClassAdvisory />} path="/advisory-grades/:advisory_id" />
            <Route element={<NewStudent />} path="/advisory/new-student/:section_id" exact/>
            <Route element={<EditStudent />} path="/advisory/update-student/:student_id" exact/>
            <Route element={<BulkStudent />} path="/advisory/bulk-new-student" exact/>
            <Route element={<CoreValues />} path="/advisory/core-values/:advisory_id" exact/>
            <Route element={<ClassAdvisoryStudents />} path="/advisory/students/:advisory_id" exact/>
            <Route element={<Assignatory />} path="/assignatory/:subject_id" exact/>
            <Route element={<TeacherLoads />} path="/teacher-loads" exact/>
            <Route element={<StudentSubjectGrades />} path="/grading/:subject_id" exact/>
            <Route element={<AccessManagement />} path="/grades-access-management" exact/>
            <Route element={<ViewLoads />} path="/grades-access-management/:teacher_id" exact/>
            <Route element={<ConsolidatedGrades />} path="/grades-consolidation" exact/>
            <Route element={<Gpa />} path="/gpa" exact/>
            <Route element={<CardTemplates />} path="/card-templates" exact />
            <Route element={<SchoolDays />} path="/institution-school-days" exact />
            <Route element={<AdvisoryAttendance />} path="/advisory/attendance/:advisory_id" exact />
            {/* ADMIN ONLY ROUTES */}
            <Route element={<Institutions />} path="/institutions"/>
            <Route element={<Users />} path="/users"/>
            <Route element={<Roles />} path="/roles"/>
            <Route element={<Permissions />} path="/permissions"/>
            <Route element={<Logout />} path="/logout" />
          </Route>
          <Route element={<CertificateBuilder />} path="/certificate-builder" />
        </Route>
      <Route element={<PublicRoutes />}>
        <Route element={<NewUserPassword />} path="/new-user-password/:user_id" />
        <Route element={<Login />} path="/login"/>
      </Route>
      <Route element={<QuickEnrollmentForm />} path="/form/:institution/:grade/:section"/>
      <Route element={<InstitutionRegistration />} path="/institution-registration"/>
    </Route>
  )
);