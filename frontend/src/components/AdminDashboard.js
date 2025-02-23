import React, { useEffect } from "react";
import { FaUserPlus, FaSignInAlt, FaUserEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import("bootstrap/dist/js/bootstrap.bundle.min");

const AdminDashboard = () => {
  const navigate = useNavigate();
  let admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    
  }, []);

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const stats = [
    { title: "Total Patients", count: 120 },
    { title: "Appointments Today", count: 15 },
    { title: "Available Doctors", count: 8 },
    { title: "New Registrations", count: 25 },
    { title: "Pending Reports", count: 10 },
    { title: "Discharged Patients", count: 30 },
  ];

  return (
    <div className="d-flex flex-column h-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" >Health Management</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to={'/profile/'+admin._id} className="btn btn-primary me-2">
                <FaUserPlus className="me-2" /> Profile
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={logout} className="btn btn-secondary me-2">
                <FaSignInAlt className="me-2" /> Logout
              </button>
            </li>
            <li className="nav-item">
              <Link className="btn btn-info" to={'/admin/update/'+admin._id}>
                <FaUserEdit className="me-2" /> Update Profile
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow-1 bg-light p-4 overflow-auto">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {stats.map((stat, index) => (
            <div className="col" key={index}>
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">{stat.title}</h5>
                  <p className="card-text fs-2">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
          <li className="nav-item">
              <Link className="btn btn-info item-center" to={'/patient/search'}>
                <FaUserEdit className="me-2" /> Check Up Patient
              </Link>
            </li>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
