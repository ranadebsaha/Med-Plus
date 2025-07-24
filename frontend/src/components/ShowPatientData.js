import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";


const ShowPatientData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]); 
  const params = useParams();
  let doc;
  useEffect(() => {
      getPatientDetails();
    },[]);
  
    const getPatientDetails = async () => {
      let result = await fetch(`http://localhost:5000/user/${params.id}`, {
        headers: {
          authorization: `bearer ${(localStorage.getItem('token'))}`
        }
      });
      result = await result.json();
      if(result.doc){
        // result= result.doc;
        // setDocuments(result.doc);
        // console.log(result.toArry());
        const formattedDocs = result.doc.map((file) => {
          try {
            if (typeof file === "string" && file.startsWith("{")) {
              const parsedFile = JSON.parse(file);
              return { ...parsedFile, url: `http://localhost:5000${parsedFile.url}` };
            }
            return {
              name: file,
              type: file.endsWith(".pdf") ? "pdf" : "image",
              url: `http://localhost:5000/uploads/${file}`,
            };
          } catch (error) {
            console.error("Error parsing file:", file);
            return null;
          }
        });
        setDocuments(formattedDocs);
      }
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Your Documents</h4>
        </div>
        <div className="card-body">
          <div className="d-flex gap-3 flex-wrap">
            {documents.map((file, index) => (
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
            <Link to={'/dashboard'} className="btn btn-danger">Cancel</Link>
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

export default ShowPatientData;
