import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import RegisterAdmin from "./components/AdminRegister";
import LoginAdmin from "./components/AdminLogin";
import AdminUpdate from "./components/AdminUpdate";
import PatientUpdate from "./components/PatientUpdate";
import ShowPatientData from "./components/ShowPatientData";
import Upload from "./components/Upload";
import Profile from "./components/Profile";
import SearchPatient from "./components/SearchPatient";
import PatientDetail from "./components/PatientDetail";
import PatientForm from "./components/PatientForm";

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/update/:id" element={<AdminUpdate />} />
        <Route path="/patient/update/:id" element={<PatientUpdate />} />
        <Route path="/upload/:id" element={<Upload />} />
        <Route path="/admin/patient/show/:id" element={<PatientDetail />} />
        <Route path="/patient/show/:id" element={<ShowPatientData />} />
        <Route path="/patient/search" element={<SearchPatient />} />
        <Route path="/patient/book" element={< PatientForm/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;