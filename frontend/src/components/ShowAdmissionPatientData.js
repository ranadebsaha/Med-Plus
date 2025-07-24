import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

const ShowAdmissionPatientData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState(null);
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showFullFeedback, setShowFullFeedback] = useState(false);

  const [showCheckupModal, setShowCheckupModal] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [comment, setComment] = useState("");

  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargeDoctor, setDischargeDoctor] = useState("");
  const [dischargeNote, setDischargeNote] = useState("");

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`http://localhost:5000/hospital/admission/${id}`, {
        headers: { authorization: `bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.admission) {
        setAdmission(data.admission);
        setPatient(data.admission.patient_id);
        const docList = data.admission.patient_id?.doc || [];
        const formattedDocs = docList.map(file => {
          try {
            if (typeof file === "string" && file.startsWith("{")) {
              const parsed = JSON.parse(file);
              return { ...parsed, url: `http://localhost:5000${parsed.url}` };
            }
            return {
              name: file,
              type: file.endsWith(".pdf") ? "pdf" : "image",
              url: `http://localhost:5000/uploads/${file}`,
            };
          } catch {
            return null;
          }
        }).filter(Boolean);
        setDocuments(formattedDocs);
      } else {
        console.error("Admission data not found");
      }
    } catch (err) {
      console.error("Error fetching admission data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckupSubmit = async () => {
    if (!doctorName || !comment) {
      Swal.fire("Error", "Please fill in both Doctor Name and Feedback.", "error");
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`http://localhost:5000/hospital/admit/feedback/${admission._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ doctor_name: doctorName, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Feedback submitted successfully!", "success");
        setShowCheckupModal(false);
        setDoctorName("");
        setComment("");
        loadDetails();
      } else {
        Swal.fire("Error", data.message || "Failed to submit feedback.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    }
  };

  const handleDischarge = async () => {
    if (!dischargeDoctor || !dischargeNote) {
      Swal.fire("Error", "Please fill in both Doctor Name and Discharge Note.", "error");
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`http://localhost:5000/hospital/admit/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          status: "discharged",
          doctor: dischargeDoctor,
          discharge_note: dischargeNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Discharged", data.message, "success");
        setShowDischargeModal(false);
        loadDetails();
      } else {
        Swal.fire("Error", data.message || "Failed to discharge patient.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  if (loading) {
    return <h5 className="text-center mt-5 text-muted">Loading Patient Admission Info...</h5>;
  }

  return (
    <div className="container mt-4">
      {admission && patient ? (
        <>
          {/* Admission Info */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4>Admission Information</h4>
            </div>
            <div className="card-body">
              <p><strong>Reason:</strong> {admission.reason}</p>
              <p><strong>Aadhar:</strong> {admission.aadhar}</p>
              <p><strong>Status:</strong> {admission.status}</p>
              <p><strong>Admission Date:</strong> {new Date(admission.admission_date).toLocaleString()}</p>
              <p><strong>Discharge Note:</strong> {admission.discharge_note || "N/A"}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-success text-white">
              <h4>Patient Information</h4>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>DOB:</strong> {patient.dob}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Mobile:</strong> {patient.mobile_no}</p>
              <p><strong>Address:</strong> {patient.address}</p>
            </div>
          </div>

          {/* Patient History */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-info text-white">
              <h4>Patient History</h4>
            </div>
            <div className="card-body">
              {patient.history?.length ? (
                <>
                  <ul className="list-group">
                    {(showFullHistory ? patient.history : patient.history.slice(-3)).map((h, i) => (
                      <li key={i} className="list-group-item">
                        <strong>{new Date(h.date).toLocaleString()}:</strong> {h.cause}
                      </li>
                    ))}
                  </ul>
                  {patient.history.length > 3 && (
                    <div className="mt-2 text-center">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setShowFullHistory(!showFullHistory)}>
                        {showFullHistory ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </>
              ) : <p>No history available.</p>}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h4>Doctor Feedback</h4>
            </div>
            <div className="card-body">
              {admission.feedback?.length ? (
                <>
                  <ul className="list-group">
                    {(showFullFeedback ? admission.feedback : admission.feedback.slice(-3)).map((f, i) => (
                      <li key={i} className="list-group-item">
                        <strong>{f.doctor_name}</strong> [{new Date(f.date).toLocaleString()}]: {f.comment}
                      </li>
                    ))}
                  </ul>
                  {admission.feedback.length > 3 && (
                    <div className="mt-2 text-center">
                      <button className="btn btn-outline-warning btn-sm" onClick={() => setShowFullFeedback(!showFullFeedback)}>
                        {showFullFeedback ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </>
              ) : <p>No feedback available.</p>}
            </div>
          </div>

          {/* Documents */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h4>Uploaded Documents</h4>
            </div>
            <div className="card-body d-flex gap-3 flex-wrap">
              {documents.map((file, i) => (
                <div key={i} className="card p-2" style={{ width: "300px" }}>
                  <div className="card-body text-center">
                    <p>{file.name}</p>
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="img-fluid"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedFile(file)}
                      />
                    ) : (
                      <>
                        <iframe src={file.url} title={file.name} width="100%" height="200px" />
                        <button className="btn btn-primary mt-2" onClick={() => setSelectedFile(file)}>
                          View
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="d-flex justify-content-end gap-2 mb-5">
            <Button variant="success" onClick={() => setShowCheckupModal(true)}>Checkup</Button>
            <Button variant="warning" onClick={() => setShowDischargeModal(true)}>Discharge</Button>
            <Link to="/patient/admission/search" className="btn btn-danger">Back</Link>
          </div>
        </>
      ) : <h5 className="text-center text-muted">No data available</h5>}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedFile.name}</h5>
                <button className="btn-close" onClick={() => setSelectedFile(null)}></button>
              </div>
              <div className="modal-body text-center">
                {selectedFile.type === "image" ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="img-fluid" />
                ) : (
                  <iframe src={selectedFile.url} title={selectedFile.name} width="100%" height="500px"></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkup Modal */}
      {showCheckupModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Patient Checkup</h5>
                <button className="btn-close" onClick={() => setShowCheckupModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Doctor Name</label>
                  <input className="form-control" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea className="form-control" rows="3" value={comment} onChange={e => setComment(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowCheckupModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleCheckupSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Modal */}
      {showDischargeModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Discharge Patient</h5>
                <button className="btn-close" onClick={() => setShowDischargeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Doctor Name</label>
                  <input className="form-control" value={dischargeDoctor} onChange={e => setDischargeDoctor(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Discharge Note</label>
                  <textarea className="form-control" rows="3" value={dischargeNote} onChange={e => setDischargeNote(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDischargeModal(false)}>Cancel</Button>
                <Button variant="warning" onClick={handleDischarge}>Discharge</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAdmissionPatientData;
