// ===========================================
// XSS TESTING PLAYGROUND - SERVER
// ===========================================
// Main entry point for the Express server
// Serves both API and React static files
// ===========================================

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

// Initialize Express app
const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ===========================================
// API ROUTES
// ===========================================

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// ===========================================
// API STATUS ENDPOINT
// ===========================================

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'XSS Playground API is running',
    sanitizationEnabled: config.ENABLE_SANITIZATION,
    timestamp: new Date().toISOString(),
  });
});

// ===========================================
// SERVE REACT STATIC FILES
// ===========================================

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// Handle React routing - send all non-API requests to React
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ===========================================
// ERROR HANDLING MIDDLEWARE
// ===========================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ===========================================
// DATABASE CONNECTION & SERVER START
// ===========================================

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Start server
    app.listen(config.PORT, config.HOST, () => {
      console.log('\n===========================================');
      console.log('🎀 POOKIEPING SERVER RUNNING');
      console.log('===========================================');
      console.log(`📍 Local:    http://localhost:${config.PORT}`);
      console.log(`📍 Network:  http://<YOUR_LOCAL_IP>:${config.PORT}`);
      console.log('===========================================');
      console.log(`🔒 Sanitization: ${config.ENABLE_SANITIZATION ? 'ENABLED (Safe)' : 'DISABLED (Unsafe - XSS Active)'}`);
      console.log('===========================================');
      console.log('\n📋 To find your local IP address:');
      console.log('   Windows: ipconfig | Find "IPv4"');
      console.log('   Mac/Linux: ifconfig | grep inet');
      console.log('\n⚠️  Make sure Windows Firewall allows port', config.PORT);
      console.log('===========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('   - Run: mongod');
    console.log('2. Check if port', config.PORT, 'is available');
    console.log('3. Verify MongoDB URI in config.js');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start the server
startServer();
