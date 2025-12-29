const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

module.exports = router;