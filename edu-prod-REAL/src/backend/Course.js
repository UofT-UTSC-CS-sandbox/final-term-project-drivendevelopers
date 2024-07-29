const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseCode: String,
  credits: Number,
  semester: String,
  year: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Course', courseSchema);