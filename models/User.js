// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure you hash passwords before storing
  // Add other fields as necessary
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);