const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  programName: { type: String },
  yearOfStudy: { type: String },
  gpa: { type: Number },
  description: { type: String },  // Add description field
  profilePicture: { type: String }  // Add profile picture field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
