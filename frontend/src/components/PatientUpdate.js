import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import './PatientUpdate.css'
import { Link, useNavigate, useParams } from "react-router-dom";


function PatientUpdate() {

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
  const params = useParams();

  useEffect(() => {
    getProductDetails();
  }, [])

  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:5000/user/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    setAadhar(result.aadhar);
    setName(result.name);
    setDob(result.dob);
    setGender(result.gender);
    setMobile_no(result.mobile_no);
    setEmail(result.email);
    setAddress(result.address);
  }

  const updateUser = async () => {
    if (!aadhar || !name || !dob || !gender || !mobile_no || !email || !address || !password || !cpassword) {
      setError(true);
      return false;
    }
    let result = await fetch(`http://localhost:5000/user/${params.id}`, {
      method: 'put',
      body: JSON.stringify({ aadhar, name, dob, gender, mobile_no, email, address, password }),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    navigate('/dashboard');
  }

  return (
    <Form className="container">
      <div className="head">
        <Form.Label className="text">Patient Details Update</Form.Label>
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
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
              {error && !password && <span>Enter a Password</span>}
            </Col>
            <Col md={6}>
              <Form.Label>New Confirm Password</Form.Label>
              <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirm Password" />
              {error && !cpassword && <span>Enter your Password again</span>}
            </Col>
          </Row>
        </Form.Group>
      </div>

      <div className="submit">
        <Button variant="success" onClick={updateUser} >
          Update
        </Button>
        <Link className="btn btn-primary" variant="primary" to="/dashboard">
          Cancel
        </Link>
      </div>
    </Form>
  );
}

export default PatientUpdate;