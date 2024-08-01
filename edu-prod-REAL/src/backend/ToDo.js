const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  state: { type: String, default: 'In Progress', enum: ['Not Started', 'In Progress', 'Completed', 'Blocked', 'Canceled'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ToDo', toDoSchema);
