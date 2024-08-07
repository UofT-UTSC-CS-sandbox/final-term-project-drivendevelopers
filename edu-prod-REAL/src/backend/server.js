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
const Resource = require('./Resource');
const moment = require('moment-timezone');
const ToDo = require('./ToDo');
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

/**
 * @route POST /api/gpa
 * @description Save GPA calculation
 * @access Private
 */

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
/**
 * @route GET /api/gpa
 * @description Fetch saved GPAs
 * @access Private
 */

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
/**
 * @route DELETE /api/gpa/:id
 * @description Delete a saved GPA
 * @access Private
 */
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
// Course Schema
const courseSchema = new mongoose.Schema({
  courseName: String,
  courseCode: String,
  credits: Number,
  semester: String,
  year: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Course = mongoose.model('Course', courseSchema);

/**
 * @route POST /api/degree-planner
 * @description Add a new course to the degree planner
 * @access Private
 */
app.post('/api/degree-planner', authenticateToken, async (req, res) => {
  const { courseName, courseCode, credits, semester, year } = req.body;

  try {
    const newCourse = new Course({
      courseName,
      courseCode,
      credits,
      semester,
      year,
      userId: req.user.id,
    });

    await newCourse.save();
    res.status(201).json({ course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Failed to add course' });
  }
});

/**
 * @route GET /api/degree-planner
 * @description Get all courses for the authenticated user
 * @access Private
 */
app.get('/api/degree-planner', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

/**
 * @route DELETE /api/degree-planner/:id
 * @description Delete a course by its ID
 * @access Private
 */
app.delete('/api/degree-planner/:id', authenticateToken, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

/**
 * @route POST /register
 * @description Register a new user
 * @access Public
 */
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
/**
 * @route POST /login
 * @description Login a user and return a token
 * @access Public
 */
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

/**
 * @route POST /api/projects
 * @description Add a new project
 * @access Private
 */

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

/**
 * @route GET /api/projects
 * @description Get all projects of the authenticated user
 * @access Private
 */

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});
/**
 * @route DELETE /api/projects/:projectId
 * @description Delete a project by ID
 * @access Private
 */
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
/**
 * @route PUT /api/profile
 * @description Update the user profile
 * @access Private
 */
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
/**
 * @route GET /api/profile
 * @description Get the profile of the authenticated user
 * @access Private
 */
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
/**
 * @route GET /api/profile/:id
 * @description Get the profile of a user by ID
 * @access Private
 */
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
/**
 * @route POST /api/search-users
 * @description Search users by different criteria
 * @access Private
 */
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

/**
 * @route POST /api/friend-request
 * @description Send a friend request to another user
 * @access Private
 */

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
/**
 * @route GET /api/friend-requests
 * @description Get all friend requests for the authenticated user
 * @access Private
 */
app.get('/api/friend-requests', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests', 'fullName');
    res.status(200).json(user.friendRequests);
  } catch (err) {
    console.error('Error fetching friend requests:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @route DELETE /api/friend-request/:id
 * @description Delete a friend request by ID
 * @access Private
 */
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

/**
 * @route POST /api/friend-request/accept/:id
 * @description Accept a friend request
 * @access Private
 */
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
/**
 * @route GET /api/friends
 * @description Get all friends of the authenticated user
 * @access Private
 */
app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'fullName profilePicture');
    res.status(200).json(user.friends);
  } catch (err) {
    console.error('Error fetching friends:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @route DELETE /api/friends/:id
 * @description Remove a friend by ID
 * @access Private
 */
app.delete('/api/friends/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendId = req.params.id;
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    await user.save();
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
/**
 * @route POST /api/discussions
 * @description Create a new discussion
 * @access Private
 */
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
/**
 * @route GET /api/discussions
 * @description Get all discussions
 * @access Private
 */
app.get('/api/discussions', authenticateToken, async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('userId', 'email');
    res.status(200).json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Failed to fetch discussions', error });
  }
});
/**
 * @route GET /api/discussions/:id
 * @description Get a discussion by ID
 * @access Private
 */
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
/**
 * @route POST /api/discussions/:discussionId/comments
 * @description Add a comment to a discussion
 * @access Private
 */
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
/**
 * @route GET /api/discussions/:discussionId/comments
 * @description Get all comments for a discussion
 * @access Private
 */
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

/**
 * @route POST /api/events
 * @description Create a new event
 * @access Private
 */
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, location, start, end, friends, timezone } = req.body;
    const newEvent = new Event({
      title,
      location,
      start: moment.tz(start, timezone).utc().toDate(), // Convert to UTC
      end: moment.tz(end, timezone).utc().toDate(), // Convert to UTC
      createdBy: req.user.id,
      invitedFriends: friends,
      inviteStatus: friends.map(friendId => ({ userId: friendId, status: 'Pending', _id: new mongoose.Types.ObjectId() }))
    });
    await newEvent.save();
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
/**
 * @route POST /api/events/:eventId/accept/:inviteId
 * @description Accept an event invite
 * @access Private
 */



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
/**
 * @route POST /api/events/:eventId/reject/:inviteId
 * @description Reject an event invite
 * @access Private
 */
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
/**
 * @route POST /api/events/:eventId/accept
 * @description Accept an event invite without invite ID
 * @access Private
 */
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
    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite accepted', event });
  } catch (err) {
    console.error('Error accepting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @route POST /api/events/:eventId/reject
 * @description Reject an event invite without invite ID
 * @access Private
 */
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
    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter(notification => notification.eventId.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event invite rejected' });
  } catch (err) {
    console.error('Error rejecting event invite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @route GET /api/events/invites
 * @description Get all event invites for the authenticated user
 * @access Private
 */
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

/**
 * @route GET /api/events
 * @description Get all events based on filter
 * @access Private
 */
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const { filter } = req.query;
    let events;

    if (filter === 'created') {
      events = await Event.find({ createdBy: req.user.id }).populate('createdBy', 'fullName').populate('attendees', 'fullName');
    } else if (filter === 'attendee') {
      events = await Event.find({ attendees: req.user.id }).populate('createdBy', 'fullName').populate('attendees', 'fullName');
    } else {
      events = await Event.find({
        $or: [
          { createdBy: req.user.id },
          { attendees: req.user.id }
        ]
      }).populate('createdBy', 'fullName').populate('attendees', 'fullName');
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/notifications
 * @description Send a notification to a user
 * @access Private
 */
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
/**
 * @route GET /api/notifications
 * @description Get all notifications for the authenticated user
 * @access Private
 */
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
/**
 * @route DELETE /api/events/:eventId
 * @description Delete an event by ID
 * @access Private
 */
app.delete('/api/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }
    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @route POST /api/events/:eventId/remove-attendee
 * @description Remove an attendee from an event
 * @access Private
 */
app.post('/api/events/:eventId/remove-attendee', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.attendees.includes(req.user.id)) {
      event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
      await event.save();
      return res.status(200).json({ message: 'You have been removed from the event', event });
    }
    if (event.createdBy.toString() === req.user.id) {
      return res.status(403).json({ message: 'Use a different endpoint to delete the event' });
    }

    res.status(403).json({ message: 'You are not authorized to remove yourself from this event' });
  } catch (err) {
    console.error('Error removing attendee:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

const connectionsRoutes = require('../connections');
app.use('/api', connectionsRoutes);

// Resource library routes
/**
 * @route POST /api/resources
 * @description Add a new resource
 * @access Private
 */
app.post('/api/resources', authenticateToken, async (req, res) => {
  const { title, link, description, tags } = req.body;

  try {
    const newResource = new Resource({
      title,
      link,
      description,
      tags: tags || [], // Ensure tags are an array
      userId: req.user.id
    });

    await newResource.save();
    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (err) {
    console.error('Error adding resource:', err.message);
    res.status(500).json({ message: 'Error adding resource' });
  }
});

/**
 * @route GET /api/resources
 * @description Get all resources
 * @access Private
 */
app.get('/api/resources', authenticateToken, async (req, res) => {
  try {
    const resources = await Resource.find().populate('userId', 'email');
    res.status(200).json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err.message);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

/**
 * @route DELETE /api/resources/:id
 * @description Delete a resource by ID
 * @access Private
 */
app.delete('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err.message);
    res.status(500).json({ message: 'Error deleting resource' });
  }
});

/**
 * @route GET /api/todos
 * @description Get all to-do items for the authenticated user, optionally filtered by state
 * @access Private
 */
app.get('/api/todos', authenticateToken, async (req, res) => {
  const { state } = req.query;
  try {
    const query = { userId: req.user.id };
    if (state) {
      query.state = state;
    }
    const todos = await ToDo.find(query);
    res.status(200).json(todos);
  } catch (err) {
    console.error('Error fetching to-do items:', err.message);
    res.status(500).json({ message: 'Error fetching to-do items' });
  }
});

/**
 * @route POST /api/todos
 * @description Add a new to-do item
 * @access Private
 */
app.post('/api/todos', authenticateToken, async (req, res) => {
  const { title, priority } = req.body;

  try {
    const newToDo = new ToDo({
      title,
      priority,
      userId: req.user.id,
    });

    await newToDo.save();
    res.status(201).json(newToDo);
  } catch (err) {
    console.error('Error adding to-do item:', err.message);
    res.status(500).json({ message: 'Error adding to-do item' });
  }
});

/**
 * @route PUT /api/todos/:id
 * @description Update a to-do item's state
 * @access Private
 */
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  const { state } = req.body;

  try {
    const todo = await ToDo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'To-do item not found' });
    }

    todo.state = state;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    console.error('Error updating to-do item:', err.message);
    res.status(500).json({ message: 'Error updating to-do item' });
  }
});

/**
 * @route DELETE /api/todos/:id
 * @description Delete a to-do item by ID
 * @access Private
 */
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await ToDo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'To-do item not found' });
    }

    res.status(200).json({ message: 'To-do item deleted successfully' });
  } catch (err) {
    console.error('Error deleting to-do item:', err.message);
    res.status(500).json({ message: 'Error deleting to-do item' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
