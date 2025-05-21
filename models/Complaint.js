const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  subDepartment: String,
  complaintType: String,
  complaintText: String,
  file: {
    filename: String,
    path: String,
    originalname: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
