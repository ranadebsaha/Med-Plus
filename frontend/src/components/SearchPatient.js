import React, { useEffect, useState } from "react";
import { FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const SearchPatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/admin/login");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
        let result = await fetch(`http://localhost:5000/search/${key}`,{
            headers:{
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        if (result) {
            setPatientData(result);
        }
    }else{
      setPatientData([]);
    }

};


  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
        <Link className="navbar-brand fw-bold" to="/">Health Management</Link>
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
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <button onClick={goBack} className="btn btn-outline-light me-2 px-4 py-2">
                <FaArrowLeft className="me-2" /> Back
              </button>
            </li>
            <li className="nav-item">
              <button onClick={logout} className="btn btn-danger px-4 py-2">
                <FaSignInAlt className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="bg-light p-4">
        <div className="container">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm border p-3"
              placeholder="Enter 12-digit Aadhar number..."
              // value={searchTerm}
              onChange={searchHandle}
              // maxLength={14}
            />
            {/* <button className="btn btn-primary" onClick={handleSearch}>Search</button> */}
          </div>
        </div>
      </div>

      <main className="flex-grow-1 bg-light p-4">
        <div className="container">
          {patientData.length > 0 ? patientData.map((patient, index) => (
            <div key={index} className="card shadow p-4 mb-3">
              <h4 className="text-center mb-3">Patient Details</h4>
              <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Name:</strong> Patient A</li>
                <li className="list-group-item"><strong>Date Of Birth:</strong> {patient.dob}</li>
                <li className="list-group-item"><strong>Aadhar Number:</strong> {patient.aadhar}</li>
              </ul>
              <Link to={'/admin/patient/show/'+patient._id}>Show Patient Details</Link>
              <button onClick={goBack} className="btn btn-primary">
                <FaArrowLeft className="me-2" /> Back
              </button>
            </div>
          )) :
          <h1> No Patient Found</h1>
          }
        </div>
      </main>
    </div>
  );
};

export default SearchPatient;
