import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/dashboard');
    }
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      return false;
    }
    let result = await fetch('http://localhost:5000/login', {
      method: 'post',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result.auth) {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', JSON.stringify(result.auth));
      navigate('/dashboard');
    } else {
      alert("Please enter correct details")
    }

  }

  return (
    <Form className='container main-container'>
      <div className='head'>
        <Form.Label className='text'>Patient Login Portal</Form.Label>
        <Form.Label className='underline'></Form.Label>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email ID</Form.Label>
          <div className='input'>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
          </div>
          {error && !email && <span>Enter a Email</span>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          < div className='input'>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          {error && !password && <span>Enter a Password</span>}
        </Form.Group>
        <Form.Label className='forgot-password'>Not Registered?<Link to="/register"> <span>Click here</span></Link></Form.Label>
      </div>
      <div className='submit'><Button variant="primary" onClick={handleLogin}>Login</Button></div>
    </Form>
  );
}

export default Login;


