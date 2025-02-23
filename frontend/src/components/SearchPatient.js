import React, { useEffect, useState } from "react";
import { FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import Logo from "../assets/Logo.svg";
import "../styles/SearchPatient.css";

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

      let result = await fetch(`http://localhost:5000/search/${key}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setPatientData(result);
      }
    } else {

      setPatientData([]);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar variant="light" expand="lg" className="nav fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={Logo} alt="Logo" height="15" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" className="menu" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              <Button variant="outline-dark" className="back-btn" onClick={goBack}>
                <FaArrowLeft className="me-2" /> Back
              </Button>
              <Button variant="danger" className="logout-btn" onClick={logout}>
                <FaSignInAlt className="me-2" /> Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="bg-light p-4 mt-5">
        <Container>
          <Form.Control type="text" className="form-control-lg shadow-sm border p-3" placeholder="Enter 12-digit Aadhar number..." onChange={searchHandle} />
        </Container>
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

        <Container>
          {patientData.length > 0 ? (
            patientData.map((patient, index) => (
              <div key={index} className="card shadow p-4 mb-3">
                <h4 className="text-center mb-3">Patient Details</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Age:</strong> {patient.age}
                  </li>
                  <li className="list-group-item">
                    <strong>Aadhar Number:</strong> {patient.aadhar}
                  </li>
                </ul>
                <Link to={`/admin/patient/show/${patient._id}`} className="btn btn-primary mt-3" >
                  View Patient Details
                </Link>
              </div>
            ))
          ) : (
            <h1 className="text-center">No Patient Found</h1>
          )}
        </Container>

      </main>
    </div>
  );
};

export default SearchPatient;
