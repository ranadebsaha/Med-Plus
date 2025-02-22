import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Dropdown, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./AdminRegister.css";

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
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const adminRegister = async () => {
    if (!dept || !govt_id || !name || !dob || !gender || !mobile_no || !email || !password || !cpassword) {
      setError(true);
      return;
    }

    let result = await fetch("http://localhost:5000/admin/register", {
      method: "POST",
      body: JSON.stringify({ dept, govt_id, name, dob, gender, mobile_no, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    result = await result.json();
    if (result) {
      navigate("/admin/login");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin");
    if (auth) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <Card className="p-4 shadow-lg rounded register-card">
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Admin Registration</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Dropdown onSelect={(eventKey) => setDept(eventKey)}>
                <Dropdown.Toggle variant="outline-primary" className="w-100">
                  {dept || "Select Department"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {departments.map((dept, index) => (
                    <Dropdown.Item key={index} eventKey={dept}>
                      {dept}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {error && !dept && <span className="text-danger">Choose Department</span>}
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control type="number" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} placeholder="Enter ID Number" />
                  {error && !govt_id && <span className="text-danger">Enter a valid ID</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Full Name" />
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
                    <Form.Check
                      inline
                      type="radio"
                      label="Female"
                      value="female"
                      name="gender"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Other"
                      value="others"
                      name="gender"
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                  {error && !gender && <span className="text-danger">Choose Gender</span>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="number"
                    value={mobile_no}
                    onChange={(e) => setMobile_no(e.target.value)}
                    placeholder="Enter Mobile Number"
                  />
                  {error && !mobile_no && <span className="text-danger">Enter a valid Mobile No</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                  />
                  {error && !email && <span className="text-danger">Enter a valid Email</span>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                  />
                  {error && !password && <span className="text-danger">Enter Password</span>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                  {error && !cpassword && <span className="text-danger">Confirm Password</span>}
                </Form.Group>
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button variant="primary" size="lg" onClick={adminRegister}>
                Register
              </Button>
            </div>
            <div className="text-center mt-3">
              <Form.Text className="text-muted">
                Already Registered?{" "}
                <Link to="/admin/login" className="text-primary fw-bold">
                  Click here
                </Link>
              </Form.Text>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminRegister;
