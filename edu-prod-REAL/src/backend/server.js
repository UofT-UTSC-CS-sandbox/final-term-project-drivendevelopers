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
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://c01Project:EduProd1@cluster0.ieebveo.mongodb.net/edu-prod?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
// src/backend/server.js

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
app.get('/api/connections', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recommendations = await User.find({
      interests: { $in: user.interests },
      _id: { $ne: req.user.id }
    });

    res.status(200).json(recommendations);
  } catch (err) {
    console.error('Error fetching recommendations:', err.message);
    res.status(500).json({ message: 'Error fetching recommendations' });
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Discussion board endpoints
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

/*
// fetch info for a single post (DiscussionDetail.js)
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

// endpoints for discussion post commenting
app.post('/api/discussions/:discussionId/comments', authenticateToken, async (req, res) => {
  const { content } = req.body;

  try {
    const newComment = new Comment({
      content,
      discussionId: req.params.discussionId,
      userId: req.user.id,
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

app.get('/api/discussions/:discussionId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ discussion: req.params.discussionId }).populate('user', 'fullName profilePicture');
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});
*/
// endpoints for discussion post commenting
app.post('/api/discussions/:discussionId/comments', authenticateToken, async (req, res) => {
  const { content } = req.body;

  try {
    const newComment = new Comment({
      content,
      discussionId: req.params.discussionId,
      userId: req.user.id,
    });

    await newComment.save();
    // Optionally, populate the user information in the response
    await newComment.populate('userId', 'email fullName profilePicture').execPopulate();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Adjusted to populate 'userId' correctly in the comments fetching endpoint
app.get('/api/discussions/:discussionId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ discussionId: req.params.discussionId })
      .populate('userId', 'email fullName profilePicture'); // Ensure correct population

    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Adjusted endpoint to use 'discussionId' instead of 'discussion'
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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
