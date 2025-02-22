import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './AdminLogin.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const departments = ["Doctor", "Admin", "Staff", "Nurse"];
  const [dept, setDept] = useState("");
  const [govt_id, setGovt_id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('admin');
    if (auth) {
      navigate('/admin/dashboard');
    }
  });

  const handleLogin = async () => {
    if (!dept || !govt_id || !password) {
      setError(true);
      return false;
    }
    let result = await fetch('http://localhost:5000/admin/login', {
      method: 'post',
      body: JSON.stringify({ dept,govt_id, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result.auth) {
      localStorage.setItem('admin', JSON.stringify(result.admin));
      localStorage.setItem('token', JSON.stringify(result.auth));
      navigate('/admin/dashboard');
    } else {
      alert("Please enter correct details")
    }

  }

  return (
    <Form className='container'>
      <div className='head'>
        <Form.Label className='text'>Admin Login Portal</Form.Label>
        <Form.Label className='underline'></Form.Label>
        <Form.Label>Department</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <div className='input'>
            <Form.Control type="text" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} placeholder="Enter Email" />
          </div>
          {error && !govt_id && <span>Enter a ID</span>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          < div className='input'>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          {error && !password && <span>Enter a Password</span>}
        </Form.Group>
        <Form.Label className='forgot-password'>Not Registered?<Link to="/admin/register"> <span>Click here</span></Link></Form.Label>
      </div>
      <div className='submit'><Button variant="primary" onClick={handleLogin}>Login</Button></div>
    </Form>
  );
}

export default AdminLogin;

