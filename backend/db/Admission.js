const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  admission_date: {
    type: Date,
    default: Date.now
  },
  department: {
    type: String
  },
  doctor: String,
  aadhar: String,
  reason: {
    type: String,
    required: true
  },
  bed_no: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'discharged'],
    default: 'pending'
  },
  discharge_date: Date,
  discharge_note: {
  type: String,
  default: ''
},

  feedback: [
    {
      doctor_name: String,
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('admissions', admissionSchema);
