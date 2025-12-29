const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  markHelpful,
  deleteReview
} = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/product/:productId', optionalAuth, getProductReviews);

router.use(protect); // Authentication required

router.post('/', createReview);
router.put('/:id/helpful', markHelpful);
router.delete('/:id', deleteReview);

module.exports = router;