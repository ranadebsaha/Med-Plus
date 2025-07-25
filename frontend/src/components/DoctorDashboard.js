import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaUserEdit,
  FaTachometerAlt,
  FaNotesMedical,
  FaHistory
} from "react-icons/fa";
import "../styles/AdminDashboard.css";
import Swal from 'sweetalert2';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (!admin) navigate("/");
  }, [admin, navigate]);

  const logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of the system.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      navigate('/');
      Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
    }
  });
};

  const stats = [
    { title: "Total Patients", count: 120 },
    { title: "Appointments Today", count: 15 },
    { title: "New Registrations", count: 25 },
    { title: "Pending Reports", count: 10 },
    { title: "Discharged Patients", count: 30 }
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-dark text-white">
        <h3 className="text-center mb-4 fw-bold">Doctor Panel</h3>
        <ul className="nav nav-pills flex-column mb-auto bg-dark">
          <li className="nav-item mb-2">
            <Link to="/doctor/dashboard" className="nav-link text-white">
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to={`/profile/${admin._id}`} className="nav-link text-white">
              <FaUserPlus className="me-2" />
              Profile
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to={`/admin/update/${admin._id}`} className="nav-link text-white">
              <FaUserEdit className="me-2" />
              Update Profile
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/patient/search" className="nav-link text-white">
              <FaNotesMedical className="me-2" />
              Check Up OPD Patient
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/patient/admission/search" className="nav-link text-white">
              <FaNotesMedical className="me-2" />
              Check Up Patient
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to={`/doctor/history/${admin._id}`} className="nav-link text-white">
              <FaHistory className="me-2" />
              History
            </Link>
          </li>
        </ul>
        <hr />
        <button className="btn btn-danger w-100" onClick={logout}>
          <FaSignInAlt className="me-2" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light min-vh-100">
        <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {stats.map((stat, index) => (
            <div className="col" key={index}>
              <div className="card text-center shadow h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{stat.title}</h5>
                  <p className="card-text display-6">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
