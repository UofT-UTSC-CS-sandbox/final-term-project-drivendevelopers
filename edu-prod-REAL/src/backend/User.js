const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'First Last' },
  programName: { type: String, default: 'Program' },
  yearOfStudy: { type: String, default: 'Year' },
  gpa: { type: Number, default: 0.0 },
  description: { type: String, default: 'About me' },  // Add description field
  profilePicture: { type: String }  // Add profile picture field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
