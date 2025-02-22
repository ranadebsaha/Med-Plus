import React, { useEffect } from 'react';
import { FaUserPlus, FaSignInAlt, FaUserEdit } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    let user=JSON.parse(localStorage.getItem('user'));

    const logout = () => {
        localStorage.clear();
        navigate('/');
    }
    return (
        <div className="d-flex flex-column flex-md-row h-100" style={{ height: '100vh' }}>
            <div className="bg-dark text-white p-4 d-flex flex-column" style={{ width: '250px', minHeight: '100vh' }}>
                <h2 className="mb-4">Health Management</h2>
                <Link to={'/profile/'+user._id} className="btn btn-primary w-100 mb-2 d-flex align-items-center">
                    <FaUserPlus className="me-2" /> Profile
                </Link>
                <Link to={'/patient/update/'+user._id} className="btn btn-info w-100 mb-2 d-flex align-items-center">
                    <FaUserEdit className="me-2" /> Update Profile
                </Link>
                <Link to={'/upload/'+user._id} className="btn btn-info w-100 mb-2 d-flex align-items-center">
                    <FaUserEdit className="me-2" /> Upload Documents
                </Link>
                <button onClick={logout} className="btn btn-secondary w-100 mb-2 d-flex align-items-center">
                    <FaSignInAlt className="me-2" /> Logout
                </button>
                <div className="flex-grow-1"></div>
            </div>


            <div className="flex-grow-1 bg-light p-4 overflow-auto">

                <nav className="navbar navbar-light bg-white mb-4 shadow-sm">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">Patient Dashboard</span>
                    </div>
                </nav>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Patients</h5>
                                <p className="card-text fs-2">120</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Appointments Today</h5>
                                <p className="card-text fs-2">15</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Available Doctors</h5>
                                <p className="card-text fs-2">8</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">New Registrations</h5>
                                <p className="card-text fs-2">25</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Pending Reports</h5>
                                <p className="card-text fs-2">10</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Discharged Patients</h5>
                                <p className="card-text fs-2">30</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
