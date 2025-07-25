import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ShowAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [searchGovtId, setSearchGovtId] = useState('');
  const [searchedAdmins, setSearchedAdmins] = useState(null); // expect an array

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch('http://localhost:5000/admin', {
        headers: { authorization: `bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(data);
      } else {
        Swal.fire('Error', data.message || 'Failed to load admins', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire('Error', 'Server error while loading admins', 'error');
    }
  };

  const handleSearch = async () => {
    if (!searchGovtId.trim()) {
      Swal.fire('Warning', 'Please enter a Govt ID.', 'warning');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch(`http://localhost:5000/search/admin/${searchGovtId}`, {
        headers: { authorization: `bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setSearchedAdmins(data);
      } else {
        Swal.fire('Not Found', data.result || 'No admin/staff found', 'warning');
        setSearchedAdmins([]);
      }
    } catch (err) {
      Swal.fire('Error', 'Error fetching admin details', 'error');
    }
  };

  const clearSearch = () => {
    setSearchedAdmins(null);
    setSearchGovtId('');
  };

  const renderTableRows = (data) => {
    return data.map((admin, index) => (
      <tr key={index}>
        <td>{admin.name}</td>
        <td>{admin.govt_id}</td>
        <td>{admin.dept}</td>
        <td>{admin.gender}</td>
        <td>{admin.dob}</td>
        <td>{admin.email}</td>
        <td>{admin.mobile_no}</td>
      </tr>
    ));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">All Doctors & Staff</h4>
          {searchedAdmins && (
            <button className="btn btn-sm btn-light" onClick={clearSearch}>Show All</button>
          )}
        </div>

        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Search by Govt ID"
              className="form-control"
              value={searchGovtId}
              onChange={(e) => setSearchGovtId(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSearch}>Search</button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Govt ID</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Email</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {searchedAdmins
                  ? renderTableRows(searchedAdmins)
                  : renderTableRows(admins)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAdmin;
