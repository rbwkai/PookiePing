// ===========================================
// AUTHENTICATION MIDDLEWARE
// ===========================================
// Protects routes that require authentication
// Verifies JWT tokens from Authorization header
// ===========================================

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Authentication middleware
 * Expects: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authorization header provided' 
      });
    }
    
    // Check Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authorization format. Use: Bearer <token>' 
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please log in again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
}

module.exports = authMiddleware;
