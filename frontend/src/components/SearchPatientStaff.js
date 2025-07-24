import React, { useState } from "react";
import {
  Navbar, Nav, Container, Button, Form, Spinner
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";

const SearchPatientStaff = () => {
  const [user, setUser] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const key = e.target.value.trim();
    setSearchKey(key);

    if (key.length < 4) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));

      const res = await fetch(`http://localhost:5000/search/user/${key}`, {
        headers: {
          authorization: `bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // if multiple users found, pick the first one
          setUser(data[0]);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/admin/login");
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar variant="light" expand="lg" className="nav fixed-top shadow-sm bg-white">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={Logo} alt="Logo" height="30" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto gap-2">
              <Button variant="outline-dark" onClick={goBack}>Back</Button>
              <Button variant="danger" onClick={logout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Search Bar */}
      <div className="bg-light pt-5 mt-5">
        <Container className="pt-4">
          <Form.Control
            type="text"
            className="form-control-lg shadow-sm border p-3"
            placeholder="Search by Aadhar..."
            maxLength="12"
            value={searchKey}
            onChange={handleSearch}
          />
        </Container>
      </div>

      {/* Search Results */}
      <main className="flex-grow-1 bg-light p-4">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Searching patient info...</p>
            </div>
          ) : user ? (
            <div className="card shadow p-4 mb-3">
              <h4 className="text-center mb-3">Patient Info</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
                <li className="list-group-item"><strong>Aadhar:</strong> {user.aadhar}</li>
                <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                <li className="list-group-item"><strong>Mobile:</strong> {user.mobile_no}</li>
                <li className="list-group-item"><strong>Gender:</strong> {user.gender}</li>
                <li className="list-group-item"><strong>Address:</strong> {user.address}</li>
              </ul>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/upload/${user._id}`)}
                >
                  Upload Report
                </Button>
              </div>
            </div>
          ) : (
            searchKey.length >= 4 && (
              <h5 className="text-center text-muted mt-4">
                No patient found with this Aadhar.
              </h5>
            )
          )}
        </Container>
      </main>
    </div>
  );
};

export default SearchPatientStaff;
