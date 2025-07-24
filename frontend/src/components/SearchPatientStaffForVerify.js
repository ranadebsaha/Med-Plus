import React, { useState, useEffect } from "react";
import {
    Navbar, Nav, Container, Button, Form, Spinner, Modal
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../assets/Logo.svg";

const SearchPatientStaffForVerify = () => {
    const [patients, setPatients] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [form, setForm] = useState({ doctor: '', bed_no: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllAdmissions();
    }, []);

    const fetchAllAdmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/hospital/admission/pending", {
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
            const res = await fetch(`http://localhost:5000/admission/patient/pending/search/${key}`, {
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

    const openVerifyModal = (admission) => {
        setSelectedPatient(admission);
        setForm({
            doctor: admission.doctor || '',
            bed_no: admission.bed_no || ''
        });
        setShowModal(true);
    };

    const handleVerify = async () => {
        if (!form.doctor || !form.bed_no) {
            Swal.fire("Missing Info", "Please enter doctor name and bed number", "warning");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/hospital/admit/update/${selectedPatient._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify({
                    doctor: form.doctor,
                    bed_no: form.bed_no,
                    status: "active"
                })
            });

            const result = await res.json();

            if (res.ok) {
                Swal.fire("Verified", result.message, "success");
                setShowModal(false);
                fetchAllAdmissions();
            } else {
                Swal.fire("Failed", result.message || "Something went wrong", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Server error occurred", "error");
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
                                    <h4 className="text-center mb-3">Pending Patient</h4>
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
                                        onClick={() => openVerifyModal(admission)}
                                    >
                                        Verify Patient
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        <h5 className="text-center text-muted mt-4">No Admitted Patients Found</h5>
                    )}
                </Container>
            </main>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Verify Admission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Doctor Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.doctor}
                                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                                placeholder="Enter doctor's name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bed Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.bed_no}
                                onChange={(e) => setForm({ ...form, bed_no: e.target.value })}
                                placeholder="Enter bed number"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleVerify}>
                        Confirm Verify
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SearchPatientStaffForVerify;
