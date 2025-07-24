const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require("cors");
const path = require("path");
require('./db/config');
const User = require('./db/User');
const Admin = require('./db/Admin');
const OpdPatient = require('./db/OpdPatient');
const Admission = require('./db/Admission');
const jwt = require('jsonwebtoken');
const { json } = require('stream/consumers');
const jwtkey = process.env.JWT_SECRET || "rds";
// const nodemailer = require('nodemailer');
const transporter = require('./db/mailer');

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//User Register
app.post("/register", async (req, resp) => {
  try {
    const { email, aadhar } = req.body;
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { aadhar: aadhar }
      ]
    });

    if (existingUser) {
      let conflict = '';
      if (existingUser.email === email) conflict = 'Email';
      if (existingUser.aadhar === aadhar) conflict = conflict ? 'Email and Aadhar' : 'Aadhar';
      return resp.status(409).send({ result: `${conflict} already registered` });
    }

    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    if (result) {
      resp.send(result);
    } else {
      resp.status(400).send({ result: 'Enter valid details' });
    }
  } catch (error) {
    console.error("Registration error:", error);
    resp.status(500).send({ result: "Internal Server Error" });
  }
});


// User Login
app.post('/login', async (req, resp) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ id: user._id }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: 'Something went wrong' });
        } else {
          resp.send({ user, auth: token });
        }
      });
    } else {
      resp.send({ result: 'No user Found' });
    }
  } else {
    resp.send({ result: 'No user Found' });
  }
});

//Admin Register
app.post("/admin/register", async (req, resp) => {
  try {
    const { email, govt_id } = req.body;

    // Check if email or govt_id is already registered
    const existingAdmin = await Admin.findOne({
      $or: [{ email: email }, { govt_id: govt_id }],
    });

    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return resp.status(409).json({ message: "Email already registered" });
      } else {
        return resp.status(409).json({ message: "ID number already registered" });
      }
    }

    const admin = new Admin(req.body);
    let result = await admin.save();
    result = result.toObject();
    delete result.password;

    jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        return resp.status(500).json({ message: "Something went wrong" });
      } else {
        resp.status(200).json({ result, auth: token });
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    resp.status(500).json({ message: "Server error" });
  }
});



//Admin Login
app.post('/admin/login', async (req, resp) => {
  if (req.body.govt_id && req.body.password) {
    let admin = await Admin.findOne(req.body).select("-password");
    if (admin) {
      if (admin.dept == req.body.dept) {
        jwt.sign({ admin }, jwtkey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            resp.send({ result: 'Something went wrong' });
          } else {
            resp.send({ admin, auth: token });
          }
        });
      } else {
        resp.send({ result: 'No user Found' });
      }

    } else {
      resp.send({ result: 'No user Found' });
    }
  } else {
    resp.send({ result: 'No user Found' });
  }
});

//One User Fetch
app.get('/user/:id', verifyToken, async (req, resp) => {
  let result = await User.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: 'no record found' });
  }
});

//One User Update
app.put('/user/:id', verifyToken, async (req, resp) => {
  let result = await User.updateOne(
    { _id: req.params.id },
    {
      $set: req.body
    }
  )
  resp.send(result);
});

//One Admin Fetch
app.get('/admin/:id', verifyToken, async (req, resp) => {
  let result = await Admin.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: 'no record found' });
  }
});

//One Admin Update
app.put('/admin/:id', verifyToken, async (req, resp) => {
  let result = await Admin.updateOne(
    { _id: req.params.id },
    {
      $set: req.body
    }
  )
  resp.send(result);
});

// Upload Documents 
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: async function (req, file, cb) {
      let user = await User.findOne({ _id: req.params.id });
      const fileExt = path.extname(file.originalname);

      let finalFileName = `${user.aadhar}-${file.originalname}`;
      cb(null, finalFileName);
    }
  })
}).single("file");

app.put("/upload/:id", upload, async (req, resp) => {

  // let file1='/uploads/'+req.file.filename;
  const fileExt = path.extname(req.file.filename).toLowerCase();
  const fileType = fileExt === ".pdf" ? "pdf" : "image";
  const fileUrl = `/uploads/${req.file.filename}`;
  let result = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { doc: JSON.stringify({ name: req.file.filename, type: fileType, url: fileUrl }) } },
    { new: true }
  );
  resp.send(result);
});


// Search Patient from users DB
app.get('/search/user/:key', verifyToken, async (req, resp) => {
  try {
    const users = await User.find({
      aadhar: { $regex: req.params.key }
    });

    if (users && users.length > 0) {
      resp.send(users);
    } else {
      resp.status(404).send({ result: 'No result Found' });
    }
  } catch (error) {
    console.error("Search error:", error);
    resp.status(500).send({ message: "Internal Server Error" });
  }
});



// Search Patient from OPD
app.get('/search/:key', verifyToken, async (req, resp) => {
  try {
    const users = await OpdPatient.find({
      $and: [
        { status: "pending" },
        {
          $or: [
            { aadhar: { $regex: req.params.key } }
          ]
        }
      ]
    });

    if (users && users.length > 0) {
      resp.send(users);
    } else {
      resp.status(404).send({ result: 'No result Found' });
    }
  } catch (error) {
    console.error("Search error:", error);
    resp.status(500).send({ message: "Internal Server Error" });
  }
});

//update patient information in the admin and patient db
app.post('/admin/update-patient-history', verifyToken, async (req, res) => {
  const { admin_id, patient_id, patient, opd_id } = req.body;

  if (!admin_id || !patient_id || !patient || !opd_id) {
    return res.status(400).json({ message: 'admin_id, patient_id, opd_id, and patient data are required' });
  }

  try {
    const adminUpdate = await Admin.updateOne(
      { _id: admin_id },
      { $push: { patient } }
    );

    const userUpdate = await User.updateOne(
      { _id: patient_id },
      { $push: { history: patient } }
    );

    const opdUpdate = await OpdPatient.updateOne(
      { _id: opd_id },
      { $set: { status: "done" } }
    );

    res.status(200).json({
      message: 'History updated and OPD marked done',
      adminUpdate,
      userUpdate,
      opdUpdate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating records' });
  }
});


//Book OPD Appointment
app.post('/opd/book', verifyToken, async (req, res) => {
  try {
    const { department, date, time, reason } = req.body;

    if (!department || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingBooking = await OpdPatient.findOne({
      aadhar: user.aadhar,
      date,
      department
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'You have already booked an appointment for this department on this date.'
      });
    }

    const newOpd = new OpdPatient({
      patient_id: user._id,
      aadhar: user.aadhar,
      department,
      date,
      time,
      reason
    });

    const saved = await newOpd.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Appointment Confirmation',
      text: `Dear ${user.name},\n\nYour OPD appointment has been booked successfully.\n\nDetails:\nDepartment: ${department}\nDate: ${date}\nTime: ${time}\n\nPlease arrive 10 minutes early.\n\nThank you,\nMED+ Team`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email error:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Appointment booked successfully. A confirmation email has been sent.',
      data: saved
    });

  } catch (err) {
    console.error('OPD booking error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


//Send Otp and request access of that patient
app.post('/admin/request-access/:patientId', verifyToken, async (req, res) => {
  try {
    const patient = await User.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpCreatedAt = new Date();
    await User.findByIdAndUpdate(req.params.patientId, { otp, otpCreatedAt });

    const mailOptions = {
      from: `"Hospital HMS" <${process.env.EMAIL_USER}>`,
      to: patient.email,
      subject: 'Patient Data Access OTP',
      html: `
        <p>Dear <strong>${patient.name}</strong>,</p>
        <p>Your OTP for approving access to your medical records is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes. Do not share this with anyone.</p>
        <br>
        <p>Thanks,<br>MED+ Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to patient's email" });

  } catch (err) {
    console.error("OTP Email Error:", err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});


//verify the otp and get patient the details
app.post('/admin/verify-access/:patientId', verifyToken, async (req, res) => {
  const { otp } = req.body;

  try {
    const patient = await User.findById(req.params.patientId).select('-password');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (!patient.otp || patient.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const now = new Date();
    const expiryTime = 5 * 60 * 1000;
    if (now - patient.otpCreatedAt > expiryTime) {
      return res.status(410).json({ message: 'OTP has expired' });
    }
    await User.findByIdAndUpdate(req.params.patientId, {
      $unset: { otp: 1, otpCreatedAt: 1 }
    });

    const opdHistory = await OpdPatient.find({ patient_id: patient._id });

    res.status(200).json({
      message: 'OTP verified. Access granted.',
      patient,
      opdAppointments: opdHistory
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});


//admission form fill by patient
app.post('/hospital/admit/request', verifyToken, async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingAdmission = await Admission.findOne({
      patient_id: user._id,
      status: { $in: ['pending', 'active'] }
    });

    if (existingAdmission) {
      return res.status(409).json({
        message: 'You already have an admission request. Please visit the hospital to confirm, delete, or update your status.'
      });
    }

    const admission = new Admission({
      patient_id: user._id,
      aadhar: user.aadhar,
      reason,
      status: 'pending'
    });

    const result = await admission.save();

    const mailOptions = {
      from: `"Hospital Management" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Admission Request Has Been Submitted',
      html: `
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Your hospital admission request has been successfully submitted.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please visit the hospital soon to proceed with the admission.</p>
        <br>
        <p>Thank you,<br>MED+ Team</p>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err.message);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: 'Admission request submitted and confirmation email sent',
      admission: result
    });

  } catch (err) {
    console.error("Admission error:", err);
    res.status(500).json({ message: 'Error submitting request' });
  }
});

//update admission patient details
app.put('/hospital/admit/update/:id', verifyToken, async (req, res) => {
  const { bed_no, doctor, status, discharge_note, department } = req.body;

  if (!status || !['active', 'discharged'].includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status' });
  }

  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    admission.bed_no = bed_no || admission.bed_no;
    admission.doctor = doctor || admission.doctor;
    admission.department = department || admission.department;
    admission.status = status;
    if (status === 'active') {
      admission.admission_date = new Date();
    }
    if (status === 'discharged') {
      admission.discharge_date = new Date();
      admission.discharge_note = discharge_note || 'Discharged successfully';

      const userUpdate = await User.findByIdAndUpdate(
        admission.patient_id,
        {
          $push: {
            history: {
              department: admission.department,
              doctor: admission.doctor,
              date: new Date(),
              cause: admission.reason,
              note: admission.discharge_note
            }
          }
        },
        { new: true }
      );

      const adminUpdate = await Admin.findOneAndUpdate(
        { name: admission.doctor },
        {
          $push: {
            patient: {
              aadhar: userUpdate?.aadhar || '',
              date: new Date().toISOString().split('T')[0],
              cause: admission.reason
            }
          }
        }
      );
    }

    const result = await admission.save();

    res.status(200).json({
      message: `Admission ${status === 'active' ? 'activated' : 'discharged'} successfully`,
      admission: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});


//store and update the feedback
app.put('/hospital/admit/feedback/:id', verifyToken, async (req, res) => {
  const { doctor_name, comment } = req.body;

  if (!doctor_name || !comment) {
    return res.status(400).json({ message: 'doctor_name and comment are required' });
  }

  try {
    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          feedback: {
            doctor_name,
            comment,
            date: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedAdmission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.status(200).json({
      message: 'Feedback added successfully',
      admission: updatedAdmission
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add feedback' });
  }
});


// Get all admission patient details whose status is pending
app.get('/hospital/admission/pending', verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'pending' })
      .populate('patient_id', '-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Pending admissions fetched', admissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending admissions' });
  }
});

//Get all admission patient details whose status is active
app.get('/hospital/admission/active', verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'active' })
      .populate('patient_id', '-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Active admissions fetched', admissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch active admissions' });
  }
});

//Get all admission patient details whose status is discharged
app.get('/hospital/admissions/discharged', verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'discharged' })
      .populate('patient_id', '-password')
      .sort({ discharge_date: -1 });

    res.status(200).json({ message: 'Discharged admissions fetched', admissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch discharged admissions' });
  }
});


//Get admission patient by id
app.get('/hospital/admission/:id', verifyToken, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate('patient_id', '-password');

    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.status(200).json({ message: 'Admission found', admission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admission' });
  }
});


//Search admission patient by aadhar no whose status is pending
app.get('/admission/patient/pending/search/:key', verifyToken, async (req, resp) => {
  let user = await Admission.find({
    "$or": [
      { aadhar: { $regex: req.params.key } }
    ],
    status: 'pending'
  });
  if (user) {
    resp.send(user);
  } else {
    resp.send({ result: 'No result Found' });
  }
});



//Search admission patient by aadhar no whose status is active
app.get('/admission/patient/active/search/:key', verifyToken, async (req, resp) => {
  let user = await Admission.find({
    "$or": [
      { aadhar: { $regex: req.params.key } }
    ],
    status: 'active'
  });
  if (user) {
    resp.send(user);
  } else {
    resp.send({ result: 'No result Found' });
  }
});



//Search admission patient by aadhar no whose status is discharged
app.get('/admission/patient/discharged/search/:key', verifyToken, async (req, resp) => {
  let user = await Admission.find({
    "$or": [
      { aadhar: { $regex: req.params.key } }
    ],
    status: 'discharged'
  });
  if (user) {
    resp.send(user);
  } else {
    resp.send({ result: 'No result Found' });
  }
});







//Add Hospital details from Admin
// app.post('/hospital/add', verifyAdminToken, async (req, res) => {
//   const { reg_no, name, doe, gender, mobile_no, email, address } = req.body;

//   if (!reg_no || !name || !doe || !gender || !mobile_no || !email || !address) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const exists = await Hospital.findOne({ $or: [{ email }, { reg_no }] });
//   if (exists) return res.status(409).json({ message: 'Hospital already exists' });

//   const newHospital = new Hospital({ reg_no, name, doe, gender, mobile_no, email, address });
//   const saved = await newHospital.save();

//   res.status(201).json({ message: 'Hospital added successfully', data: saved });
// });



//Jwt Verification
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ result: 'Please add token in header' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ result: 'Token format is invalid' });
  }
  jwt.verify(token, jwtkey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ result: 'Please provide a valid token' });
    }
    req.user = decoded;
    next();
  });
};

//Admin Jwt token verification
// const verifyAdminToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(403).json({ message: 'Token missing' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(403).json({ message: 'Invalid token format' });

//   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Invalid token' });

//     const user = await Admin.findById(decoded.id);
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access only' });
//     }

//     req.user = user;
//     next();
//   });
// };



app.listen(5000);