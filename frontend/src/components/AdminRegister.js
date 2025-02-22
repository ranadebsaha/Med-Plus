import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import "./AdminRegister.css";
import { Link, useNavigate } from "react-router-dom";


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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminRegister = async () => {
    if (!dept || !govt_id || !name || !dob || !gender || !mobile_no || !email || !password || !cpassword) {
      setError(true);
      return false;
    }

    let result = await fetch('http://localhost:5000/admin/register', {
      method: "post",
      body: JSON.stringify({ dept, govt_id, name, dob, gender, mobile_no, email, password }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    result = await result.json();
    if (result) {
      navigate('/admin/login');
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem('admin');
    if (auth) {
      navigate('/admin/dashboard');
    }
  });

  return (
    <Form className="container">
      <div className="head">
        <Form.Label className="text">Admin Registration Portal</Form.Label>
        <Form.Label className="underline"></Form.Label>
        <Form.Label>Depertment</Form.Label>
        <Dropdown onSelect={(eventKey) => setDept(eventKey)}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {dept}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {departments.map((dept, index) => (
              <Dropdown.Item key={index} eventKey={dept}>
                {dept}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {error && !dept && <span>Choose Department</span>}

        <Form.Group className="mb-3">
          <Row className="row">
            <Col md={6}>
              <Form.Label>Id Number</Form.Label>
              <Form.Control type="number" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} placeholder="Enter Id Number" />
              {error && !govt_id && <span>Enter a valid ID</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name as per Aadhar" />
              {error && !name && <span>Enter a valid Name</span>}
            </Col>
          </Row>

          <Row className="row">
            <Col md={6}>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control value={dob} onChange={(e) => setDob(e.target.value)} type="date" />
              {error && !dob && <span>Enter a Date of Birth</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Gender</Form.Label>
              <div>
                <input className="sex" type="radio" onChange={(e) => setGender(e.target.value)} value="male" name="gender" /> Male
                <input className="sex" type="radio" onChange={(e) => setGender(e.target.value)} value="female" name="gender" /> Female
                <input className="sex" type="radio" onChange={(e) => setGender(e.target.value)} value="others" name="gender" /> Others
              </div>
              {error && !gender && <span>Choose Gender</span>}
            </Col>
          </Row>

          <Row className="row">
            <Col md={6}>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="number" value={mobile_no} onChange={(e) => setMobile_no(e.target.value)} placeholder="Enter Mobile Number" />
              {error && !mobile_no && <span>Enter a valid Mobile no</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email ID" />
              {error && !email && <span>Enter a valid Email ID</span>}
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row className="row">
            <Col md={6}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
              {error && !password && <span>Enter a Password</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirm Password" />
              {error && !cpassword && <span>Enter a Password</span>}
            </Col>
          </Row>
        </Form.Group>
        <Form.Label className='forgot-password'>Already Registered?<Link to="/admin/login"> <span>Click here</span></Link></Form.Label>
      </div>

      <div className="submit">
        <Button variant="primary" onClick={adminRegister}>
          Register
        </Button>
      </div>
    </Form>
  );
}

export default AdminRegister;
