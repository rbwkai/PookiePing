// ===========================================
// POSTS ROUTES
// ===========================================
// Handles wall post creation and retrieval
// Sanitization is conditionally applied based
// on config.ENABLE_SANITIZATION
// ===========================================

const express = require('express');
const Post = require('../models/Post');
const config = require('../config');
const { sanitize } = require('../utils/sanitize');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All post routes require authentication
router.use(authMiddleware);

// ===========================================
// GET /api/posts
// ===========================================
// Get all posts (newest first)
// Requires: Authentication
// ===========================================
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Plain objects for performance
    
    res.json({
      success: true,
      count: posts.length,
      sanitizationEnabled: config.ENABLE_SANITIZATION,
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
    });
  }
});

// ===========================================
// POST /api/posts
// ===========================================
// Create a new post
// Requires: Authentication
// Body: { content }
// ===========================================
// ===========================================
// DELETE /api/posts
// ===========================================
// Delete all posts (destruct)
// Requires: Authentication
// ===========================================
router.delete('/', async (req, res) => {
  try {
    await Post.deleteMany({});
    
    res.json({
      success: true,
      message: 'All posts deleted',
    });
  } catch (error) {
    console.error('Error deleting posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting posts',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    let { content } = req.body;
    
    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content is required',
      });
    }
    
    // ===========================================
    // ⚠️ XSS SANITIZATION TOGGLE
    // ===========================================
    // If ENABLE_SANITIZATION is true, sanitize input
    // If false, store raw HTML (DANGEROUS!)
    // ===========================================
    if (config.ENABLE_SANITIZATION) {
      content = sanitize(content);
    }
    
    // Create post
    const post = new Post({
      author: req.user.username,
      content,
    });
    
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      sanitized: config.ENABLE_SANITIZATION,
      post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
    });
  }
});

module.exports = router;
