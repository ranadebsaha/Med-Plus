const mongoose = require('mongoose');

const HospitalDetailsSchema = new mongoose.Schema({
  reg_no: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  doe: {
    type: Date,
    required: true
  },
  mobile_no: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HospitalDetails', HospitalDetailsSchema);
