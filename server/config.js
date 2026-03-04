// ===========================================
// CONFIGURATION FILE
// ===========================================
// This file contains all configurable options
// for the PookiePing application
// ===========================================

// Load environment variables from .env file (in project root)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  // ===========================================
  // ⚠️ POOKIEPING MODE TOGGLE (CRITICAL)
  // ===========================================
  // Set to false: Raw HTML stored & rendered (UNSAFE - XSS works)
  // Set to true:  Input sanitized before saving (SAFE - XSS blocked)
  // ===========================================
  ENABLE_SANITIZATION: false,

  // ===========================================
  // SERVER CONFIGURATION
  // ===========================================
  PORT: process.env.PORT || 6209,
  
  // For local testing use 'localhost'
  // For LAN access (other devices on WiFi) use '0.0.0.0'
  HOST: 'localhost',

  // ===========================================
  // DATABASE CONFIGURATION
  // ===========================================
  // Local MongoDB connection string
  // Make sure MongoDB is running locally
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/xss-playground',

  // ===========================================
  // JWT CONFIGURATION
  // ===========================================
  // IMPORTANT: Change this secret in production!
  JWT_SECRET: process.env.JWT_SECRET || 'xss-playground-secret-key-change-me',
  JWT_EXPIRES_IN: '24h',
};
