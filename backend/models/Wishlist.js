// Wishlist model - defines user wishlist schema
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  // User who owns the wishlist
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Products in the wishlist
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Remove duplicates before saving
wishlistSchema.pre('save', function(next) {
  // Remove duplicate products
  const uniqueProducts = [];
  const productIds = new Set();
  
  this.products.forEach(item => {
    const id = item.product.toString();
    if (!productIds.has(id)) {
      productIds.add(id);
      uniqueProducts.push(item);
    }
  });
  
  this.products = uniqueProducts;
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
