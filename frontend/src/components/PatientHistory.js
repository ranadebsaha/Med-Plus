import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const PatientHistory = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/user/${id}`, {
      headers: {
        authorization: `bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setPatient(data);
    } else {
      Swal.fire("Error", data.message || "Patient not found", "error");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    Swal.fire("Error", "Failed to load patient data", "error");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="text-center mt-4">Loading Patient History...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Patient History</h4>
          <Link to="/dashboard" className="btn btn-light btn-sm">Back</Link>
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {patient?.name}</p>
          <p><strong>Aadhar:</strong> {patient?.aadhar}</p>

          {patient?.history?.length ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-secondary">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Cause</th>
                  </tr>
                </thead>
                <tbody>
                  {[...patient.history].reverse().map((h, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{new Date(h.date).toLocaleString()}</td>
                      <td>{h.cause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No history records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
