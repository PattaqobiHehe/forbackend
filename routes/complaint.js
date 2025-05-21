const express = require('express');
const multer = require('multer');
const path = require('path');
const Complaint = require('/models/Complaint');
const router = express.Router();

// Multer setup - storing files in uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ensure 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB
});

// POST /api/complaints/submit
router.post('/submit', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      subDepartment,
      complaintType,
      complaintText
    } = req.body;

    const fileData = req.file
      ? {
          filename: req.file.filename,
          path: req.file.path,
          originalname: req.file.originalname
        }
      : null;

    const complaint = new Complaint({
      name,
      email,
      phone,
      department,
      subDepartment,
      complaintType,
      complaintText,
      file: fileData,
      createdAt: new Date()
    });

    await complaint.save();

    res.status(200).json({ success: true, message: 'Complaint submitted successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;