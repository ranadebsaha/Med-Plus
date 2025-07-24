import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import RegisterAdmin from "./components/AdminRegister";
import LoginAdmin from "./components/AdminLogin";
import AdminUpdate from "./components/AdminUpdate";
import PatientUpdate from "./components/PatientUpdate";
import ShowPatientData from "./components/ShowPatientData";
import Upload from "./components/Upload";
import Profile from "./components/Profile";
import SearchOPDPatient from "./components/SearchOPDPatient";
import PatientDetail from "./components/PatientDetail";
import PatientForm from "./components/OpdPatientForm";
import AdmissionForm from "./components/AdmissionForm";
import SearchPatient from "./components/SearchPatient";
import ShowAdmissionPatientData from "./components/ShowAdmissionPatientData";
import StaffDashboard from "./components/StaffDashboard";
import SearchPatientStaff from "./components/SearchPatientStaff";
import SearchPatientStaffForVerify from "./components/SearchPatientStaffForVerify";

function Layout({ children }) {
  const location = useLocation();
  return (
    <>
      <MyNavbar />
      {children}
      {location.pathname === "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin/register" element={<Layout><RegisterAdmin /></Layout>} />
        <Route path="/admin/login" element={<Layout><LoginAdmin /></Layout>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/update/:id" element={<AdminUpdate />} />
        <Route path="/patient/update/:id" element={<PatientUpdate />} />
        <Route path="/upload/:id" element={<Upload />} />
        <Route path="/admin/patient/show/:id" element={<PatientDetail />} />
        <Route path="/patient/show/:id" element={<ShowPatientData />} />
        <Route path="/patient/search" element={<SearchOPDPatient />} />
        <Route path="/patient/book" element={< PatientForm/>} />
        <Route path="/patient/admission" element={< AdmissionForm/>} />
        <Route path="/patient/admission/search" element={< SearchPatient/>} />
        <Route path="/patient/admission/data/:id" element={< ShowAdmissionPatientData/>} />
        <Route path="/patient/search/staff" element={< SearchPatientStaff/>} />
        <Route path="/patient/search/staff/verify" element={< SearchPatientStaffForVerify/>} />
        {/* <Route path="/patient/admission/checkup/:id" element={< AdmissionPatientCheckUp/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;