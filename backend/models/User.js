// User model - defines user schema and methods
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },
  phone: {
    type: String,
    default: ''
  },
  // User role - either 'user' or 'admin'
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Shipping addresses
  addresses: [{
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  // Google OAuth data
  googleId: {
    type: String,
    default: null
  },
  // Password reset token and expiry
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving user
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate random token
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire time (1 hour)
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);