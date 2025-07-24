import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdmissionForm = () => {
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!reason.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Reason Required',
      text: 'Please provide a reason for admission.'
    });
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5000/hospital/admit/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted!',
        text: 'Your admission request has been sent.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: data?.message || 'Something went wrong. Please try again later.'
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Unable to connect to the server. Please check your internet connection or try again later.'
    });
  }
};

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">Hospital Admission Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="reason" className="form-label fw-bold">Reason for Admission</label>
            <textarea
              className="form-control form-control-lg"
              id="reason"
              name="reason"
              rows="4"
              placeholder="Describe the reason for admission"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-lg w-100">Submit</button>
            <button type="reset" className="btn btn-secondary btn-lg w-100" onClick={() => setReason('')}>Reset</button>
            <button type="button" className="btn btn-outline-dark btn-lg w-100" onClick={() => navigate('/dashboard')}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
