const Wishlist = require('../models/Wishlist');

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products.product');

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: []
      });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching wishlist'
    });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [{ product: productId }]
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.products.some(
        item => item.product.toString() === productId
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Product already in wishlist'
        });
      }

      wishlist.products.push({ product: productId });
      await wishlist.save();
    }

    wishlist = await wishlist.populate('products.product');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to wishlist'
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products.product');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing from wishlist'
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      wishlist
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing wishlist'
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};