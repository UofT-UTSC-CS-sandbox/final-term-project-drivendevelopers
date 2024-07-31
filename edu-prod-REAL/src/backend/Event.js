const mongoose = require('mongoose');

const inviteStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'Pending' }
}, { _id: true });

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invitedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteStatus: [inviteStatusSchema],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', eventSchema);
