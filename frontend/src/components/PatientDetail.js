import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import rq from "./doc/QR_1726762413.png";
import pd from "./doc/Cash Receipt2.pdf";

const PatientDetail = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const mockPatient = {
    name: "John Doe",
    age: 35,
    aadharCard: "1234-5678-9012",
    files: [
      { name: "Report.pdf", type: "pdf", url: pd },
      { name: "Example QR", type: "image", url: rq },
    ],
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Patient Details</h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{mockPatient.name}</td>
              </tr>
              <tr>
                <th>Age</th>
                <td>{mockPatient.age}</td>
              </tr>
              <tr>
                <th>Aadhar Card</th>
                <td>{mockPatient.aadharCard}</td>
              </tr>
            </tbody>
          </table>
          <h5>Uploaded Files</h5>
          <div className="d-flex gap-3 flex-wrap">
            {mockPatient.files.map((file, index) => (
              <div key={index} className="card p-2" style={{ width: "300px" }}>
                <div className="card-body text-center">
                  <p>{file.name}</p>
                  {file.type === "image" ? (
                    <img src={file.url} alt={file.name} className="img-fluid" style={{ maxWidth: "100%", cursor: "pointer" }} onClick={() => setSelectedFile(file)} />
                  ) : (
                    <div>
                      <iframe src={file.url} title={file.name} width="100%" height="200px" ></iframe>
                      <button className="btn btn-primary mt-2" onClick={() => setSelectedFile(file)} >
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 d-flex justify-content-end gap-2">
            <button className="btn btn-success" onClick={() => alert("Check-up confirmed!")}>Check Up</button>
            <button className="btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>
      {selectedFile && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedFile.name}</h5>
                <button className="btn-close" onClick={() => setSelectedFile(null)}></button>
              </div>
              <div className="modal-body text-center">
                {selectedFile.type === "image" ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="img-fluid" style={{ maxWidth: "100%" }} />
                ) : (
                  <iframe src={selectedFile.url} title={selectedFile.name} width="100%" height="500px"></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
