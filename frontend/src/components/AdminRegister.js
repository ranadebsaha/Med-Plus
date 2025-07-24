import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Dropdown, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminRegister() {
  const departments = ["Doctor", "Admin", "Staff", "Nurse"];
  const [dept, setDept] = useState("");
  const [govt_id, setGovt_id] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobile_no, setMobile_no] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [hospital, setHospital] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const adminRegister = async () => {
  const today = new Date().toISOString().split("T")[0];

  if (!dept || !govt_id || !name || !dob || !gender || !mobile_no || !email || !password || !cpassword || !hospital) {
    setError(true);
    Swal.fire("Missing Fields", "Please fill all required fields.", "warning");
    return;
  }

  if (dob >= today) {
    Swal.fire("Invalid DOB", "Date of birth must be before today.", "warning");
    return;
  }

  if (password !== cpassword) {
    Swal.fire("Password Mismatch", "Passwords do not match.", "error");
    return;
  }

  try {
    let result = await fetch("http://localhost:5000/admin/register", {
  method: "POST",
  body: JSON.stringify({ dept, govt_id, name, dob, gender, mobile_no, email, password, hospital }),
  headers: { "Content-Type": "application/json" },
});

let data = await result.json();

if (result.status === 400 || result.status === 409) {
  Swal.fire("Registration Failed", data.message || "An error occurred", "error");
} else if (result.ok && data.result && data.result._id) {
  Swal.fire("Success", "Admin registered successfully!", "success").then(() => {
    navigate("/admin/login");
  });
} else {
  Swal.fire("Server Error", "Something went wrong. Try again.", "error");
}
  } catch (err) {
    console.error(err);
    Swal.fire("Network Error", "Failed to connect to server", "error");
  }
};

  useEffect(() => {
    const auth = localStorage.getItem("admin");
    if (auth) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3" style={{ paddingTop: "80px", paddingBottom: "40px" }}>
      <Card className="p-4 shadow-lg rounded register-card">
        <Card.Body>
          <h2 className="text-center mb-4">Admin Registration</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Dropdown onSelect={(eventKey) => setDept(eventKey)}>
                <Dropdown.Toggle variant="outline-primary" className="w-100">
                  {dept || "Select Department"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {departments.map((dept, index) => (
                    <Dropdown.Item key={index} eventKey={dept}>{dept}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {error && !dept && <span className="text-danger">Choose Department</span>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hospital/Center Name</Form.Label>
              <Form.Control type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} />
              {error && !hospital && <span className="text-danger">Enter Hospital/Center Name</span>}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control type="number" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} />
                  {error && !govt_id && <span className="text-danger">Enter a valid ID</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  {error && !name && <span className="text-danger">Enter a valid Name</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  {error && !dob && <span className="text-danger">Enter Date of Birth</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <div className="gender-options">
                    <Form.Check inline type="radio" label="Male" value="male" name="gender" onChange={(e) => setGender(e.target.value)} />
                    <Form.Check inline type="radio" label="Female" value="female" name="gender" onChange={(e) => setGender(e.target.value)} />
                    <Form.Check inline type="radio" label="Other" value="others" name="gender" onChange={(e) => setGender(e.target.value)} />
                  </div>
                  {error && !gender && <span className="text-danger">Choose Gender</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control type="number" value={mobile_no} onChange={(e) => setMobile_no(e.target.value)} />
                  {error && !mobile_no && <span className="text-danger">Enter a valid Mobile No</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {error && !email && <span className="text-danger">Enter a valid Email</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {error && !password && <span className="text-danger">Enter Password</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                  {error && !cpassword && <span className="text-danger">Confirm Password</span>}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-3">
              <Button variant="primary" size="lg" onClick={adminRegister}>Register</Button>
            </div>

            <div className="text-center mt-3">
              <Form.Text className="text-muted">
                Already Registered? <Link to="/admin/login" className="text-primary fw-bold">Click here</Link>
              </Form.Text>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminRegister;
