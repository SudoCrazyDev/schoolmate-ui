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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PrivateRoutes />}>
        <Route element={<NewUserPassword />} path="/new-user-password" exact />
        <Route element={<SharedLayout />} path="/" exact>
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Sections />} path="/sections" />
          <Route element={<StudentsGrading />} path="/sections/grading" />
          <Route element={<Logout />} path="/logout" />
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route element={<Login />} path="/login"/>
      </Route>
      <Route element={<QuickEnrollmentForm />} path="/form/:grade/:section"/>
    </Route>
  )
);