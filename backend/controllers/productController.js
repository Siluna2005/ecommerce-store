// Product controller - handles all product operations
const Product = require('../models/Product');
const { uploadImage, deleteImage } = require('../config/cloudinary');

/**
 * @desc    Get all products with filters and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Search filter
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // On sale filter
    if (req.query.onSale === 'true') {
      query.onSale = true;
    }

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { averageRating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { isFeatured: -1, createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products'
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product'
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    // Handle image upload if file is provided
    let imageUrl = req.body.imageUrl;
    let images = req.body.images || [];

    // If base64 image is provided, upload to Cloudinary
    if (req.body.imageData) {
      const result = await uploadImage(req.body.imageData, 'products');
      if (result.success) {
        imageUrl = result.url;
        images.push({
          url: result.url,
          publicId: result.publicId
        });
      }
    }

    const product = await Product.create({
      ...req.body,
      imageUrl,
      images
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle new image upload if provided
    if (req.body.imageData) {
      const result = await uploadImage(req.body.imageData, 'products');
      if (result.success) {
        req.body.imageUrl = result.url;
        req.body.images = [...(product.images || []), {
          url: result.url,
          publicId: result.publicId
        }];
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product'
    });
  }
};

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find products in same category, excluding current product
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching related products'
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(6)
      .sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured products'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts
};