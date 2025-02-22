import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";

function Register() {
  const [aadhar, setAadhar] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobile_no, setMobile_no] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const collectData = async () => {
    if (!aadhar || !name || !dob || !gender || !mobile_no || !email || !address || !password || !cpassword) {
      setError(true);
      return false;
    }

    let result = await fetch('http://localhost:5000/register', {
      method: "post",
      body: JSON.stringify({ aadhar, name, dob, gender, mobile_no, email, address, password }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    result = await result.json();
    if (result) {
      navigate('/login');
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/dashboard');
    }
  });

  return (
    <Form className="container">
      <div className="head">
        <Form.Label className="text">Patient Registration Portal</Form.Label>
        <Form.Label className="underline"></Form.Label>

        <Form.Group className="mb-3">
          <Row className="row">
            <Col md={6}>
              <Form.Label>Aadhar Card Number</Form.Label>
              <Form.Control type="number" value={aadhar} onChange={(e) => setAadhar(e.target.value)} placeholder="Enter Aadhar Card Number" />
              {error && !aadhar && <span>Enter a valid Aadhar ID</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name as per Aadhar" />
              {error && !name && <span>Enter a valid name</span>}
            </Col>
          </Row>

          <Row className="row">
            <Col md={6}>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              {error && !dob && <span>Enter a valid Date of Birth</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Gender</Form.Label>
              <div>
                <input className="sex" value='male' onChange={(e) => setGender(e.target.value)} type="radio" name="gender" /> Male
                <input className="sex" value='female' onChange={(e) => setGender(e.target.value)} type="radio" name="gender" /> Female
                <input className="sex" value='others' onChange={(e) => setGender(e.target.value)} type="radio" name="gender" /> Others
              </div>
              {error && !gender && <span>Choose a Gender</span>}
            </Col>
          </Row>

          <Row className="row">
            <Col md={6}>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="number" value={mobile_no} onChange={(e) => setMobile_no(e.target.value)} placeholder="Enter Mobile Number" />
              {error && !mobile_no && <span>Enter a valid Mobile No</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email ID" />
              {error && !email && <span>Enter a valid Email</span>}
            </Col>
          </Row>

          <Row className="row">
            <Col md={6}>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />
              {error && !address && <span>Enter a valid Address</span>}
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
              {error && !cpassword && <span>Enter your Password again</span>}
            </Col>
          </Row>
        </Form.Group>
        <Form.Label className='forgot-password'>Already Registered?<Link to="/login"> <span>Click here</span></Link></Form.Label>
      </div>

      <div className="submit">
        <Button variant="primary" onClick={collectData}>
          Register
        </Button>
      </div>
    </Form>
  );
}

export default Register;
