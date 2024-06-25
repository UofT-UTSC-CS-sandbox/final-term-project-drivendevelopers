const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'First Last' },
  programName: { type: String, default: 'Program' },
  yearOfStudy: { type: String, default: 'Year' },
  gpa: { type: Number, default: 0.0 },
  description: { type: String, default: 'About me' },
  profilePicture: { type: String },
  interests: { type: [String], default: [] },
  courses: { type: [String], default: [] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
