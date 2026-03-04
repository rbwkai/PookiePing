// ===========================================
// POST MODEL
// ===========================================
// Defines the Post schema for wall messages
// Content is stored as raw HTML (intentionally)
// ===========================================

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    // No sanitization at schema level - handled by route based on config
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for sorting by newest first
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
