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

const StaffDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (!admin) navigate("/");
  }, [admin, navigate]);

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/");
    }
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
        <h3 className="text-center mb-4 fw-bold">Staff Panel</h3>
        <ul className="nav nav-pills flex-column mb-auto bg-dark">
          <li className="nav-item mb-2">
            <Link to="/staff/dashboard" className="nav-link text-white">
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Link>
          </li>
          {/* <li className="nav-item mb-2">
            <Link to={`/profile/${admin._id}`} className="nav-link text-white">
              <FaUserPlus className="me-2" />
              Profile
            </Link>
          </li> */}
          {/* <li className="nav-item mb-2">
            <Link to={`/admin/update/${admin._id}`} className="nav-link text-white">
              <FaUserEdit className="me-2" />
              Update Profile
            </Link>
          </li> */}
          <li className="nav-item mb-2">
            <Link to="/patient/search/staff" className="nav-link text-white">
              <FaNotesMedical className="me-2" />
              Upload Report
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/patient/search/staff/verify" className="nav-link text-white">
              <FaNotesMedical className="me-2" />
              Verify Admission Patient
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

export default StaffDashboard;
