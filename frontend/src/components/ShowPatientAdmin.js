import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ShowPatientAdmin = () => {
  const [patients, setPatients] = useState([]);
  const [searchAadhar, setSearchAadhar] = useState('');
  const [searchedPatients, setSearchedPatients] = useState(null); // note: array, not single object

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch('http://localhost:5000/user', {
        headers: { authorization: `bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPatients(data);
      } else {
        Swal.fire('Error', data.message || 'Failed to load users', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire('Error', 'Server error while loading users', 'error');
    }
  };

  const handleSearch = async () => {
    if (!searchAadhar.trim()) {
      Swal.fire('Warning', 'Please enter an Aadhar number.', 'warning');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch(`http://localhost:5000/search/user/${searchAadhar}`, {
        headers: { authorization: `bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setSearchedPatients(data);
      } else {
        Swal.fire('Not Found', data.result || 'No patient found', 'warning');
        setSearchedPatients([]);
      }
    } catch (err) {
      Swal.fire('Error', 'Error fetching patient details', 'error');
    }
  };

  const clearSearch = () => {
    setSearchedPatients(null);
    setSearchAadhar('');
  };

  const renderTableRows = (data) => {
    return data.map((patient, index) => (
      <tr key={index}>
        <td>{patient.name}</td>
        <td>{patient.aadhar}</td>
        <td>{patient.gender}</td>
        <td>{patient.dob}</td>
        <td>{patient.email}</td>
        <td>{patient.mobile_no}</td>
        <td>{patient.address}</td>
      </tr>
    ));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">All Registered Patients</h4>
          {searchedPatients && (
            <button className="btn btn-sm btn-light" onClick={clearSearch}>Show All</button>
          )}
        </div>

        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Search by Aadhar"
              className="form-control"
              value={searchAadhar}
              onChange={(e) => setSearchAadhar(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSearch}>Search</button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Aadhar</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {searchedPatients
                  ? renderTableRows(searchedPatients)
                  : renderTableRows(patients)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPatientAdmin;
