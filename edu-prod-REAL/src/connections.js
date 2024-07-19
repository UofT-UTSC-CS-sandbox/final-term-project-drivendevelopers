// src/connections.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./backend/User'); // Ensure the path is correct

// Middleware to verify token and get user ID
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Endpoint to get recommended connections
router.get('/recommended-connections', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendedConnections = await User.find({
      _id: { $ne: userId },
      interests: { $in: user.interests },
    });

    res.json(recommendedConnections);
  } catch (error) {
    console.error('Error fetching recommended connections:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
