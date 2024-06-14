// backend/models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String},
  programName: { type: String},
  yearOfStudy: { type: String},
  gpa: { type: Number},
  // You can add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
