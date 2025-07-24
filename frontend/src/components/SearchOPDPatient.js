import React, { useEffect, useState } from "react";
import {
  FaSignInAlt, FaArrowLeft
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar, Nav, Container, Button, Form, Spinner
} from "react-bootstrap";
import Swal from "sweetalert2";
import Logo from "../assets/Logo.svg";
import "../styles/SearchPatient.css";

const SearchOPDPatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);

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
    const key = event.target.value.trim();
    setSearchKey(key);

    if (!key || key.length < 3) {
      setPatientData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/search/${key}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPatientData(data);
      } else {
        setPatientData([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setPatientData([]);
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async (patientId,opdId) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/request-access/${patientId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      });

      const data = await res.json();

      if (res.ok) {
        // Show OTP input modal
        const { value: otp } = await Swal.fire({
          title: 'Enter OTP',
          input: 'text',
          inputLabel: 'OTP sent to patient email',
          inputPlaceholder: 'Enter the 6-digit OTP',
          inputAttributes: {
            maxlength: 6,
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Verify'
        });

        if (otp) {
          const verifyRes = await fetch(`http://localhost:5000/admin/verify-access/${patientId}`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
            body: JSON.stringify({ otp })
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Access Granted',
              text: 'You can now view patient details.',
              timer: 1500,
              showConfirmButton: false
            });
            navigate(`/admin/patient/show/${patientId}?opd_id=${opdId}`);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Verification Failed',
              text: verifyData.message || 'Invalid OTP'
            });
          }
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: data.message || 'Failed to send OTP'
        });
      }

    } catch (error) {
      console.error('Request access error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while requesting access.'
      });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar variant="light" expand="lg" className="nav fixed-top shadow-sm bg-white">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={Logo} alt="Logo" height="30" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto gap-2">
              <Button variant="outline-dark" onClick={goBack}>
                <FaArrowLeft className="me-2" /> Back
              </Button>
              <Button variant="danger" onClick={logout}>
                <FaSignInAlt className="me-2" /> Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="bg-light pt-5 mt-5">
        <Container className="pt-4">
          <Form.Control
            type="text"
            className="form-control-lg shadow-sm border p-3"
            placeholder="Enter 12-digit Aadhar number..."
            maxLength="12"
            onChange={searchHandle}
            value={searchKey}
          />
        </Container>
      </div>

      <main className="flex-grow-1 bg-light p-4">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Searching patient records...</p>
            </div>
          ) : patientData.length > 0 ? (
            patientData.map((patient, index) => (
              <div key={index} className="card shadow p-4 mb-3">
                <h4 className="text-center mb-3">Patient Details</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Department:</strong> {patient.department}
                  </li>
                  <li className="list-group-item">
                    <strong>Aadhar Number:</strong> {patient.aadhar}
                  </li>
                </ul>
                <Button
                  className="btn btn-primary mt-3"
                  onClick={() => requestAccess(patient.patient_id,patient._id)}
                >
                  View Patient Details
                </Button>
              </div>
            ))
          ) : searchKey ? (
            <h5 className="text-center text-muted mt-4">No Patient Found</h5>
          ) : (
            <h5 className="text-center text-muted mt-4">Search patient by Aadhar</h5>
          )}
        </Container>
      </main>
    </div>
  );
};

export default SearchOPDPatient;
