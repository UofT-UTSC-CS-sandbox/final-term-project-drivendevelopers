const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./User');
const Project = require('./Project');
const Discussion = require('./Discussion');
const Comment = require('./Comment');
const Event = require('./Event');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://c01Project:EduProd1@cluster0.ieebveo.mongodb.net/edu-prod?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.post('/api/gpa', authenticateToken, async (req, res) => {
  const { courses, gpa, type } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedGpas.push({ gpa, courses, type });
    await user.save();

    res.status(201).json({ message: 'GPA calculation saved successfully' });
  } catch (err) {
    console.error('Error saving GPA calculation:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/gpa', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.savedGpas);
  } catch (err) {
    console.error('Error fetching saved GPAs:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/gpa/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const gpaId = req.params.id;
    user.savedGpas = user.savedGpas.filter((_, index) => index.toString() !== gpaId);

    await user.save();
    res.status(200).json({ message: 'Saved GPA deleted successfully' });
  } catch (err) {
    console.error('Error deleting saved GPA:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email.endsWith('@mail.utoronto.ca')) {
    return res.status(400).json({ message: 'Email must be from the domain @mail.utoronto.ca' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(400).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { projectName, description, link } = req.body;

  try {
    const newProject = new Project({
      projectName,
      description,
      link,
      user: req.user.id,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project added successfully', project: newProject });
  } catch (err) {
    console.error('Error adding project:', err.message);
    res.status(500).json({ message: 'Error adding project' });
  }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

app.delete('/api/projects/:projectId', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.projectId, user: req.user.id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  const { fullName, programName, yearOfStudy, gpa, description, interests, courses } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.programName = programName;
    user.yearOfStudy = yearOfStudy;
    user.fullName = fullName;
    user.gpa = gpa;
    user.description = description;
    user.interests = JSON.parse(interests);
    user.courses = JSON.parse(courses);

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profileData = {
      email: user.email,
      fullName: user.fullName,
      gpa: user.gpa,
      programName: user.programName,
      yearOfStudy: user.yearOfStudy,
      description: user.description,
      profilePicture: user.profilePicture,
      interests: user.interests,
      courses: user.courses,
    };

    res.status(200).json(profileData);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.get('/api/profile/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profileData = {
      email: user.email,
      fullName: user.fullName,
      gpa: user.gpa,
      programName: user.programName,
      yearOfStudy: user.yearOfStudy,
      description: user.description,
      profilePicture: user.profilePicture,
      interests: user.interests,
      courses: user.courses,
    };

    res.status(200).json(profileData);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/search-users', authenticateToken, async (req, res) => {
  const { name, academicInterests, courses, program, year } = req.body;
  const query = {};

  if (name) query.fullName = { $regex: name, $options: 'i' };
  if (academicInterests) query.interests = { $regex: academicInterests, $options: 'i' };
  if (courses) query.courses = { $regex: courses, $options: 'i' };
  if (program) query.programName = { $regex: program, $options: 'i' };
  if (year) query.yearOfStudy = year;

  try {
    const users = await User.find(query).select('fullName interests courses programName yearOfStudy profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

app.post('/api/friend-request', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const recipient = await User.findById(userId);

    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (recipient.friendRequests.includes(user._id)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    recipient.friendRequests.push(user._id);
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (err) {
    console.error('Error sending friend request:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/friend-requests', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests', 'fullName');
    res.status(200).json(user.friendRequests);
  } catch (err) {
    console.error('Error fetching friend requests:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/friend-request/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.friendRequests = user.friendRequests.filter(requestId => requestId.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ message: 'Friend request removed successfully' });
  } catch (error) {
    console.error('Error removing friend request:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friend-request/accept/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends.push(friend._id);
    friend.friends.push(user._id);

    user.friendRequests = user.friendRequests.filter(requestId => requestId.toString() !== req.params.id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'fullName profilePicture');
    res.status(200).json(user.friends);
  } catch (err) {
    console.error('Error fetching friends:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/friends/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendId = req.params.id;

    // Remove friend from the user's friend list
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    await user.save();

    // Also remove the user from the friend's friend list
    const friend = await User.findById(friendId);
    if (friend) {
      friend.friends = friend.friends.filter(friend => friend.toString() !== req.user.id);
      await friend.save();
    }

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status500json({ message: 'Server error' });
  }
});

app.post('/api/discussions', authenticateToken, upload.array('images'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const images = req.files.map(file => file.path);

    const newDiscussion = new Discussion({
      title,
      description,
      images,
      userId
    });

    await newDiscussion.save();

    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Failed to create discussion', error });
  }
});

app.get('/api/discussions', authenticateToken, async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('userId', 'email');
    res.status(200).json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Failed to fetch discussions', error });
  }
});

app.get('/api/discussions/:id', authenticateToken, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id).populate('userId', 'email');
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(200).json(discussion);
  } catch (err) {
    console.error('Error fetching discussion:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/discussions/:discussionId/comments', authenticateToken, async (req, res) => {
  const { content } = req.body;

  try {
    const newComment = new Comment({
      content,
      discussionId: req.params.discussionId,
      userId: req.user.id,
    });

    await newComment.save();
    await newComment.populate('userId', 'email fullName profilePicture');

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

app.get('/api/discussions/:discussionId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ discussionId: req.params.discussionId })
      .populate('userId', 'email fullName profilePicture');

    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, location, start, end, friends } = req.body;
    const newEvent = new Event({
      title,
      location,
      start,
      end,
      createdBy: req.user.id,
      invitedFriends: friends,
      inviteStatus: friends.map(friendId => ({ userId: friendId, status: 'Pending', _id: new mongoose.Types.ObjectId() }))
    });
    await newEvent.save();

    // Notify friends about the event
    await Promise.all(friends.map(async (friendId) => {
      const user = await User.findById(friendId);
      if (user) {
        user.notifications.push({
          message: `You have been invited to an event: ${title}`,
          date: new Date(),
          eventId: newEvent._id,
          inviteId: newEvent.inviteStatus.find(invite => invite.userId.toString() === friendId.toString())._id,
        });
        await user.save();
      }
    }));

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/accept/:inviteId', authenticateToken, async (req, res) => {
  try {
    const { eventId, inviteId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const invite = event.inviteStatus.id(inviteId);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    invite.status = 'Accepted';
    event.attendees.push(req.user.id);
    await event.save();

    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite accepted', event });
  } catch (err) {
    console.error('Error accepting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/reject/:inviteId', authenticateToken, async (req, res) => {
  try {
    const { eventId, inviteId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const invite = event.inviteStatus.id(inviteId);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    invite.status = 'Rejected';
    await event.save();

    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite rejected' });
  } catch (err) {
    console.error('Error rejecting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/accept', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const invite = event.inviteStatus.find(invite => invite.userId && invite.userId.toString() === req.user.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    invite.status = 'Accepted';
    event.attendees.push(req.user.id);
    event.invitedFriends = event.invitedFriends.filter(friendId => friendId && friendId.toString() !== req.user.id);
    await event.save();

    // Remove the specific notification related to this event
    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite accepted', event });
  } catch (err) {
    console.error('Error accepting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/reject', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const invite = event.inviteStatus.find(invite => invite.userId && invite.userId.toString() === req.user.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    invite.status = 'Rejected';
    event.invitedFriends = event.invitedFriends.filter(friendId => friendId && friendId.toString() !== req.user.id);
    await event.save();

    // Remove the specific notification related to this event
    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite rejected' });
  } catch (err) {
    console.error('Error rejecting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events/invites', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ 'inviteStatus.userId': req.user.id })
      .populate('createdBy', 'fullName')
      .populate('invitedFriends', 'fullName');

    const filteredEvents = events.filter(event => {
      const invite = event.inviteStatus.find(invite => invite.userId.toString() === req.user.id);
      return invite && invite.status === 'Pending';
    });

    res.status(200).json(filteredEvents);
  } catch (err) {
    console.error('Error fetching invites:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { createdBy: req.user.id },
        { attendees: req.user.id }
      ]
    }).populate('createdBy', 'fullName').populate('attendees', 'fullName'); // Populating createdBy and attendees with full name

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
  const { userId, message } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.notifications.push({ message, date: new Date() });
    await user.save();
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Remove the event from the database
    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/remove-attendee', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is an attendee of the event
    if (event.attendees.includes(req.user.id)) {
      event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
      await event.save();
      return res.status(200).json({ message: 'You have been removed from the event', event });
    }

    // If user is the creator, handle event deletion separately
    if (event.createdBy.toString() === req.user.id) {
      return res.status(403).json({ message: 'Use a different endpoint to delete the event' });
    }

    res.status(403).json({ message: 'You are not authorized to remove yourself from this event' });
  } catch (err) {
    console.error('Error removing attendee:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add connections routes
const connectionsRoutes = require('../connections');
app.use('/api', connectionsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
