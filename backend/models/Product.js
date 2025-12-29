// Product model - defines product schema
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Product basic information
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  // Original price for sale calculations
  originalPrice: {
    type: Number,
    default: 0
  },
  // Sale/discount information
  onSale: {
    type: Boolean,
    default: false
  },
  salePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Product images - main image and additional images
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String
  }],
  // Main product image
  imageUrl: {
    type: String,
    required: [true, 'Please provide product image']
  },
  // Clothing specific fields
  category: {
    type: String,
    required: [true, 'Please select category'],
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Shoes']
  },
  subCategory: {
    type: String,
    enum: ['T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Dresses', 'Skirts', 'Jackets', 'Sweaters', 'Activewear', 'Other']
  },
  // Available sizes
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  // Total stock (sum of all sizes)
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  // Colors available
  colors: [{
    type: String
  }],
  // Material/fabric
  material: {
    type: String,
    default: ''
  },
  // Brand
  brand: {
    type: String,
    default: ''
  },
  // Tags for search
  tags: [{
    type: String
  }],
  // Product status
  isActive: {
    type: Boolean,
    default: true
  },
  // Rating information
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  // Featured product
  isFeatured: {
    type: Boolean,
    default: false
  },
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ averageRating: -1 });

// Calculate discount price if on sale
productSchema.virtual('discountPrice').get(function() {
  if (this.onSale && this.salePercentage > 0) {
    return this.price - (this.price * this.salePercentage / 100);
  }
  return this.price;
});

module.exports = mongoose.model('Product', productSchema);