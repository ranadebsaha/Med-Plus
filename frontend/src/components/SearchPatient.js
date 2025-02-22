import React, { useEffect, useState } from "react";
import { FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const SearchPatient = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const formatAadhar = (aadhar) => aadhar.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");

  const handleSearch = () => {
    if (/^\d{12}$/.test(searchTerm.replace(/\s/g, ""))) {
      const formattedAadhar = formatAadhar(searchTerm.replace(/\s/g, ""));
      const mockPatients = [
        { name: "John Doe", age: 45, aadhar: formattedAadhar },
        { name: "Jane Smith", age: 38, aadhar: formattedAadhar },
        { name: "Robert Brown", age: 50, aadhar: formattedAadhar }
      ];
      setPatientData(mockPatients);
    } else {
      alert("Please enter a valid 12-digit Aadhar number.");
      setPatientData([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setSearchTerm(formattedValue);
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
              value={searchTerm}
              onChange={handleInputChange}
              maxLength={14}
            />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <main className="flex-grow-1 bg-light p-4">
        <div className="container">
          {patientData.length > 0 && patientData.map((patient, index) => (
            <div key={index} className="card shadow p-4 mb-3">
              <h4 className="text-center mb-3">Patient Details</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Name:</strong> {patient.name}</li>
                <li className="list-group-item"><strong>Age:</strong> {patient.age}</li>
                <li className="list-group-item"><strong>Aadhar Number:</strong> {patient.aadhar}</li>
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchPatient;
