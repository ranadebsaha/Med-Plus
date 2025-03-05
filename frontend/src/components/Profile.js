import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState('');
  const params = useParams();
  const u1 = localStorage.getItem('user');
  const a1 = localStorage.getItem('admin');
  useEffect(() => {
    getProfile();
  });

  const getProfile = async (event) => {
    if (u1) {
      let result = await fetch(`http://localhost:5000/user/${params.id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      result = await result.json();
      if (result) setUser(result);
    }

    if (a1) {
      let result = await fetch(`http://localhost:5000/admin/${params.id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      result = await result.json();
      if (result) setUser(result);
    }
  };

  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 rounded" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">User Profile</Card.Title>
          <Row className="gy-2">
            <Col xs={12} md={6}><strong>ID Number:</strong> {u1 ? user.aadhar : user.govt_id}</Col>
            <Col xs={12} md={6}><strong>Name:</strong> {user.name}</Col>
            <Col xs={12} md={6}><strong>Date of Birth:</strong> {user.dob}</Col>
            <Col xs={12} md={6}><strong>Gender:</strong> {user.gender}</Col>
            <Col xs={12} md={6}><strong>Mobile Number:</strong> {user.mobile_no}</Col>
            <Col xs={12} md={6}><strong>Email ID:</strong> {user.email}</Col>
            <Col xs={12}><strong>Address:</strong> {user.address}</Col>
          </Row>
        </Card.Body>
        <div className="text-center mt-3">
          <Link to={u1 ? '/dashboard' : '/admin/dashboard'} className="btn btn-primary btn-lg w-50 login-btn">
            Back
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
