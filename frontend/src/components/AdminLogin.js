import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from "react-router-dom";
import './AdminLogin.css';

function AdminLogin() {
  const departments = ["Doctor", "Admin", "Staff", "Nurse"];
  const [dept, setDept] = useState("");
  const [govt_id, setGovt_id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('admin');
    if (auth) {
      navigate('/admin/dashboard');
    }
  }, []);

  const handleLogin = async () => {
    if (!dept || !govt_id || !password) {
      setError(true);
      return;
    }

    let result = await fetch('http://localhost:5000/admin/login', {
      method: 'POST',
      body: JSON.stringify({ dept, govt_id, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    result = await result.json();
    if (result.auth) {
      localStorage.setItem('admin', JSON.stringify(result.admin));
      localStorage.setItem('token', JSON.stringify(result.auth));
      navigate('/admin/dashboard');
    } else {
      alert("Please enter correct details");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <Card className="p-4 shadow-lg rounded login-card main-card">
        <Card.Body>
          <h2 className="text-center mb-4 admin-text">Admin Login</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Dropdown onSelect={(eventKey) => setDept(eventKey)}>
                <Dropdown.Toggle variant="outline-primary" className="w-100">
                  {dept || "Select Department"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {departments.map((department, index) => (
                    <Dropdown.Item key={index} eventKey={department}>
                      {department}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {error && !dept && <span className="text-danger drop-btn">Please select a department</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" value={govt_id} onChange={(e) => setGovt_id(e.target.value)} placeholder="Enter Government ID" className="rounded" />
              {error && !govt_id && <span className="text-danger">Please enter your ID</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className="rounded" />
              {error && !password && <span className="text-danger">Please enter your password</span>}
            </Form.Group>
            <div className="text-center mt-2">
              <Form.Text className="text-muted">
                Not Registered?{" "}
                <Link to="/admin/register" className="text-primary fw-bold">
                  Click here
                </Link>
              </Form.Text>
            </div>
            <div className="d-grid mt-4">
              <Button variant="primary" size="lg" className="rounded login-btn" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminLogin;
