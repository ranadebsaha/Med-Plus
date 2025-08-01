import React, { useState, useEffect } from "react";
import {
    Navbar, Nav, Container, Button, Form, Spinner
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../assets/Logo.svg";

const SearchPatient = () => {
    const [patients, setPatients] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllAdmissions();
    }, []);

    const fetchAllAdmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/hospital/admission/active", {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            });
            const data = await response.json();
            setPatients(data.admissions || []);
        } catch (error) {
            console.error("Failed to load admissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const key = e.target.value.trim();
        setSearchKey(key);

        if (key.length < 3) {
            fetchAllAdmissions();
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/admission/patient/active/search/${key}`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            });
            const data = await res.json();
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => navigate(-1);
    const logout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            navigate("/admin/login");
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
                            <Button variant="outline-dark" onClick={goBack}>Back</Button>
                            <Button variant="danger" onClick={logout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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

            <main className="flex-grow-1 bg-light p-4">
                <Container>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading admissions...</p>
                        </div>
                    ) : patients.length > 0 ? (
                        patients.map((admission, index) => {
                            const patient = admission.patient_id;

                            return (
                                <div key={index} className="card shadow p-4 mb-3">
                                    <h4 className="text-center mb-3">Admitted Patient</h4>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Name:</strong> {patient?.name || 'N/A'}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Aadhar:</strong> {admission.aadhar}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Reason:</strong> {admission.reason}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Doctor:</strong> {admission.doctor || 'N/A'}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Bed No:</strong> {admission.bed_no || 'N/A'}
                                        </li>
                                    </ul>
                                    <Button
                                        className="btn btn-primary mt-3"
                                        onClick={() => navigate(`/patient/admission/data/${admission._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        <h5 className="text-center text-muted mt-4">No Admitted Patients Found</h5>
                    )}
                </Container>
            </main>
        </div>
    );
};

export default SearchPatient;
