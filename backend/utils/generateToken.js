// JWT token generation utility
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRE || '7d' // Token expiration
    }
  );
};

module.exports = generateToken;