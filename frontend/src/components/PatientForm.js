import React from 'react';

const PatientForm = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center head-line mb-4">Appointment Booking Form</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">Full Name</label>
            <input type="text" className="form-control form-control-lg" id="name" placeholder="Enter full name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label fw-bold">Age</label>
            <input type="number" className="form-control form-control-lg no-spinner" id="age" placeholder="Enter age" required />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label fw-bold">State</label>
            <select className="form-select form-select-lg" id="state" required>
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="district" className="form-label fw-bold">District</label>
            <input type="text" className="form-control form-control-lg" id="district" placeholder="Enter district" required />
          </div>
          <div className="mb-3">
            <label htmlFor="hospital" className="form-label fw-bold">Hospital/Center Name</label>
            <input type="text" className="form-control form-control-lg" id="hospital" placeholder="Enter hospital or center name" required />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-lg w-100 submit-btn">Submit</button>
            <button type="reset" className="btn btn-secondary btn-lg w-100 logout-btn">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
