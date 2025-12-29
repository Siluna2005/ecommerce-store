// Authentication middleware - protect routes with JWT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token
 * Middleware to check if user is authenticated
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user account is active
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      // Handle different JWT errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired, please login again'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token, please login again'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  }

  // If no token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for routes that work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Don't fail, just continue without user
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, optionalAuth };