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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
        <Route element={<AuthInit><PrivateRoutes /></AuthInit>}>
          <Route element={<NewUserPassword />} path="/new-user-password" />
          <Route element={<SharedLayout />} path="/">
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Sections />} path="/sections" />
            <Route element={<StudentsGrading />} path="/sections/grading" />
            <Route element={<Teachers />} path="/teachers" />
            <Route element={<ClassAdvisory />} path="/advisory" />
            <Route element={<Logout />} path="/logout" />
          </Route>
        </Route>
      <Route element={<PublicRoutes />}>
        <Route element={<Login />} path="/login"/>
      </Route>
      <Route element={<QuickEnrollmentForm />} path="/form/:institution/:grade/:section"/>
    </Route>
  )
);