const mongoose = require('mongoose');

const opdPatientSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  aadhar: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("opd_patients", opdPatientSchema);

