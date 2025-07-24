import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const OpdPatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/opd/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked!',
          text: 'Your appointment has been successfully booked.',
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/dashboard'), 4000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: data.message || 'Something went wrong.'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to connect to the server.'
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center head-line mb-4">Appointment Booking Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="department" className="form-label fw-bold">Department</label>
            <select
              className="form-select form-select-lg"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label fw-bold">Preferred Date</label>
            <input
              type="date"
              className="form-control form-control-lg"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getTomorrowDate()}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label fw-bold">Preferred Time</label>
            <input
              type="time"
              className="form-control form-control-lg"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="reason" className="form-label fw-bold">Reason for Appointment</label>
            <textarea
              className="form-control form-control-lg"
              id="reason"
              name="reason"
              rows="3"
              placeholder="Describe your issue"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-lg w-100">Submit</button>
            <button type="reset" className="btn btn-secondary btn-lg w-100">Reset</button>
            <button
              type="button"
              className="btn btn-outline-dark btn-lg w-100"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpdPatientForm;
