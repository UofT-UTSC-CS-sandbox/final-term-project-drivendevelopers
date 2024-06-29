const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./User');
const Project = require('./Project');
require('dotenv').config();
const uploadFolder = process.env.UPLOADS_DIR

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://c01Project:EduProd1@cluster0.ieebveo.mongodb.net/edu-prod?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Setting up Multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    console.log(file.filename);
    cb(null, `${uniqueSuffix}-${file.filename}`);
  }
});

const upload = multer({ storage });

console.log(uploadFolder);
console.log(path.join(__dirname, '../../uploads'));
// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email.endsWith('@mail.utoronto.ca')) {
    return res.status(400).json({ message: 'Email must be from the domain @mail.utoronto.ca' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12); // Increase rounds as needed
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(400).json({ message: 'Error registering user' });
  }
});

// Login endpoint
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

// Save project endpoint
app.post('/api/projects', authenticateToken, async (req, res) => {
  const { projectName, description, link, } = req.body;

  try {
    // Create a new project associated with the authenticated user
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

// Get all projects for user
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Delete project endpoint
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

// Update user profile endpoint
app.put('/api/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  const { fullName, programName, yearOfStudy, gpa, description } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user profile fields
    user.programName = programName;
    user.yearOfStudy = yearOfStudy;
    user.fullName = fullName;
    user.gpa = gpa;
    user.description = description;

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

// Get user profile endpoint
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
    };

    res.status(200).json(profileData);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
