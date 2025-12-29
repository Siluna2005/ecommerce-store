const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Create review
const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': product,
      paymentStatus: 'paid'
    });

    const review = await Review.create({
      product,
      user: req.user._id,
      userName: req.user.name,
      rating,
      title,
      comment,
      verifiedPurchase: !!hasPurchased
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating review'
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews'
    });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    if (review.helpfulBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You already marked this review as helpful'
      });
    }

    review.helpfulBy.push(req.user._id);
    review.helpfulCount += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking review as helpful'
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only review owner or admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting review'
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  markHelpful,
  deleteReview
};
