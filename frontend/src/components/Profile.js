import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import "./Profile.css";
import { Link, useParams } from "react-router-dom";

function Profile() {

  const [user, setUser] = useState('');
  const params = useParams();
  const u1=localStorage.getItem('user');
  const a1=localStorage.getItem('admin');
  const getProfile = async (event) => {
    if(u1){
      let result = await fetch(`http://localhost:5000/user/${params.id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      result = await result.json();
      if (result) {
        setUser(result);
      }
    };
    if(a1){
      let result = await fetch(`http://localhost:5000/admin/${params.id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      result = await result.json();
      if (result) {
        setUser(result);
      }
    };
  }  
    

  useEffect(() => {
    getProfile();
  })

  return (
    <div className="container profile-container">
      <Card className="profile-card">
        <Card.Body>

          <Card.Title className="text-center text">Profile</Card.Title>

          <hr />
          <div className="text-center">
            <img src={user.photo} alt="Profile" className="profile-photo" />
          </div>
          <Col className='layer' md={6}><strong>ID Number:</strong> {u1 ? user.aadhar :user.govt_id}</Col>
          <Col md={6}><strong>Name:</strong> {user.name}</Col>
          <Col md={6}><strong>Date of Birth:</strong> {user.dob}</Col>
          <Col md={6}><strong>Gender:</strong> {user.gender}</Col>
          <Col md={6}><strong>Mobile Number:</strong> {user.mobile_no}</Col>
          <Col md={6}><strong>Email ID:</strong> {user.email}</Col>
          <Col md={12}><strong>Address:</strong> {user.address}</Col>
        </Card.Body>
        <Link to={u1 ? '/dashboard' : '/admin/dashboard'} className="btn btn-primary w-50 mb-2">
         Back
      </Link>
      </Card>
      
    </div>
  );
}

export default Profile;
