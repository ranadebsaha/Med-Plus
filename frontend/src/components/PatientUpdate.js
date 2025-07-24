import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

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
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getPatientDetails();
  }, []);

  const getPatientDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/user/${params.id}`, {
        headers: {
          authorization: `bearer ${localStorage.getItem("token")}`
        }
      });
      const result = await res.json();
      setAadhar(result.aadhar);
      setName(result.name);
      setDob(result.dob);
      setGender(result.gender);
      setMobile_no(result.mobile_no);
      setEmail(result.email);
      setAddress(result.address);
    } catch (err) {
      console.error("Failed to fetch patient details", err);
    }
  };

  const updateUser = async () => {
    if (!aadhar || !name || !dob || !gender || !mobile_no || !email || !address || !password || !cpassword) {
      setError(true);
      Swal.fire("Missing Fields", "Please fill all fields.", "warning");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (dob >= today) {
      Swal.fire("Invalid DOB", "Date of Birth must be before today.", "warning");
      return;
    }

    if (password !== cpassword) {
      Swal.fire("Password Mismatch", "Passwords do not match.", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/user/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ aadhar, name, dob, gender, mobile_no, email, address, password }),
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Patient details updated successfully.", "success").then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire("Error", result.message || "Update failed", "error");
      }
    } catch (err) {
      console.error("Update Error", err);
      Swal.fire("Server Error", "Something went wrong.", "error");
    }
  };

  return (
    <Form className="container">
      <div className="head">
        <Form.Label className="text">Patient Details Update</Form.Label>
        <Form.Label className="underline"></Form.Label>

        <Form.Group className="mb-3">
          <Row>
            <Col md={6}>
              <Form.Label>Aadhar Card Number</Form.Label>
              <Form.Control type="number" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
              {error && !aadhar && <span className="text-danger">Enter a valid Aadhar ID</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {error && !name && <span className="text-danger">Enter a valid name</span>}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              {error && !dob && <span className="text-danger">Enter a valid DOB</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Gender</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  name="gender"
                  label="Male"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="gender"
                  label="Female"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="gender"
                  label="Others"
                  value="others"
                  checked={gender === "others"}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
              {error && !gender && <span className="text-danger">Choose a Gender</span>}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="number" value={mobile_no} onChange={(e) => setMobile_no(e.target.value)} />
              {error && !mobile_no && <span className="text-danger">Enter a valid mobile number</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && !email && <span className="text-danger">Enter a valid email</span>}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
              {error && !address && <span className="text-danger">Enter a valid address</span>}
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col md={6}>
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && !password && <span className="text-danger">Enter a password</span>}
            </Col>
            <Col md={6}>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
              {error && !cpassword && <span className="text-danger">Confirm your password</span>}
            </Col>
          </Row>
        </Form.Group>
      </div>

      <div className="submit d-flex gap-2">
        <Button variant="success" onClick={updateUser}>Update</Button>
        <Link className="btn btn-primary" to="/dashboard">Cancel</Link>
      </div>
    </Form>
  );
}

export default PatientUpdate;
