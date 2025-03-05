import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useRef } from 'react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                setFile(null);
                fileInputRef.current.value = '';
            } else {
                setError('');
                setFile(selectedFile);
            }
        }
    };

    const handleCancel = () => {
        setFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        let result = await fetch(`http://localhost:5000/upload/${params.id}`, {
            method: "put",
            body: formData,
        });
        result = await result.json();

        if (result) {
            alert(`Uploading: ${file.name} as ${file.fileType} ${file.fileType === "Other" ? `with details:` : ''}`);
            navigate(-1);

            alert(`Uploading: ${file.name}`);
            navigate('/patient/search');

        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-4">Upload File</h2>
                <div className="mb-3">
                    <input type="file" className="form-control form-control-lg" onChange={handleFileChange} ref={fileInputRef} accept=".pdf,.jpg,.jpeg" />
                </div>
                {error && <p className="text-danger text-center">{error}</p>}
                {file && (
                    <div className="file-info text-center mb-3">
                        <p><strong>Selected File:</strong> {file.name}</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-danger btn-lg w-100 logout-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn btn-primary btn-lg w-100 submit-btn" onClick={handleUpload}>
                                Upload
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
