// ===========================================
// AUTHENTICATION ROUTES
// ===========================================
// Handles user registration and login
// ===========================================

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

// ===========================================
// POST /api/auth/register
// ===========================================
// Register a new user
// Body: { username, password }
// ===========================================
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }
    
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters',
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
    }
    
    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      password,
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
});

// ===========================================
// POST /api/auth/login
// ===========================================
// Login an existing user
// Body: { username, password }
// ===========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }
    
    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

module.exports = router;
