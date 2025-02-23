import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";

function AdminUpdate() {
  const params = useParams();
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

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:5000/admin/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    setGovt_id(result.govt_id);
    setName(result.name);
    setDob(result.dob);
    setGender(result.gender);
    setMobile_no(result.mobile_no);
    setEmail(result.email);
  };

  const updateAdmin = async () => {
    if (!govt_id || !name || !dob || !gender || !mobile_no || !email || !password || !cpassword) {
      setError(true);
      return;
    }
    let result = await fetch(`http://localhost:5000/admin/${params.id}`, {
      method: 'put',
      body: JSON.stringify({ govt_id, name, dob, gender, mobile_no, email, password }),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    navigate('/admin/dashboard');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4 overflow-auto">
      <Form className="p-4 shadow-lg border rounded-3 bg-light w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Admin Details Update</h3>  
        <Form.Group className="mb-3">
          <Row className="gy-3">
            <Col xs={12} md={6}>
              <Form.Label>Id Number</Form.Label>
              <Form.Control type="number" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} placeholder="Enter Id Number" />
              {error && !govt_id && <span className="text-danger">Enter a valid ID</span>}
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name as per Aadhar" />
              {error && !name && <span className="text-danger">Enter a valid Name</span>}
            </Col>
          </Row>

          <Row className="gy-3">
            <Col xs={12} md={6}>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              {error && !dob && <span className="text-danger">Enter a Date of Birth</span>}
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Gender</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check type="radio" label="Male" value="male" name="gender" onChange={(e) => setGender(e.target.value)} />
                <Form.Check type="radio" label="Female" value="female" name="gender" onChange={(e) => setGender(e.target.value)} />
                <Form.Check type="radio" label="Others" value="others" name="gender" onChange={(e) => setGender(e.target.value)} />
              </div>
              {error && !gender && <span className="text-danger">Choose Gender</span>}
            </Col>
          </Row>
          <Row className="gy-3">
            <Col xs={12} md={6}>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="number" value={mobile_no} onChange={(e) => setMobile_no(e.target.value)} placeholder="Enter Mobile Number" />
              {error && !mobile_no && <span className="text-danger">Enter a valid Mobile no</span>}
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email ID" />
              {error && !email && <span className="text-danger">Enter a valid Email ID</span>}
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row className="gy-3">
            <Col xs={12} md={6}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
              {error && !password && <span className="text-danger">Enter a Password</span>}
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirm Password" />
              {error && !cpassword && <span className="text-danger">Enter a Password</span>}
            </Col>
          </Row>
        </Form.Group>
        <div className="text-center mt-3">
          <Button variant="success" onClick={updateAdmin} className="me-2 px-4 update-btn">
            Update
          </Button>
          <Link className="btn btn-primary px-4 login-btn" to="/admin/dashboard">
            Back
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default AdminUpdate;
