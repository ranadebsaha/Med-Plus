import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams,Link } from "react-router-dom";

const DoctorHistory = () => {
  const { id } = useParams(); // Doctor ID
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`http://localhost:5000/admin/${id}`, {
        headers: {
          authorization: `bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setDoctor(data);
      } else {
        console.error("Failed to load doctor data");
      }
    } catch (err) {
      console.error("Error fetching doctor data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h5 className="text-center mt-4 text-muted">Loading Doctor History...</h5>;

  if (!doctor) return <h5 className="text-center mt-4 text-danger">Doctor not found</h5>;

  return (
    <div className="container mt-4">
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Doctor Information</h4>
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Mobile:</strong> {doctor.mobile_no}</p>
          <p><strong>Gender:</strong> {doctor.gender}</p>
          <p><strong>DOB:</strong> {new Date(doctor.dob).toLocaleDateString()}</p>
          <p><strong>Department:</strong> {doctor.dept}</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4>Patient Checkup History</h4>
        </div>
        <div className="card-body">
          {doctor.patient && doctor.patient.length > 0 ? (
            <ul className="list-group">
              {doctor.patient.slice().reverse().map((entry, index) => (
                <li key={index} className="list-group-item">
                  <strong>Date:</strong> {new Date(entry.date).toLocaleString()}<br />
                  <strong>Patient Aadhar:</strong> {entry.aadhar}<br />
                  <strong>Cause:</strong> {entry.cause}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No history available.</p>
          )}
        </div>
        
      </div>
      <div className="text-center mt-3">
                <Link to={'/doctor/dashboard'} className="btn btn-primary btn-lg w-50 login-btn mb-5">
                  Back
                </Link>
              </div>
    </div>
  );
};

export default DoctorHistory;
