const express = require('express');
const router = express.Router();
const {
  getPayHereConfig,
  createPayment,
  handlePayHereNotify
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Get PayHere configuration
router.get('/payhere-config', getPayHereConfig);

// Create payment (protected route)
router.post('/create', protect, createPayment);

// PayHere notification webhook (no auth needed)
router.post('/payhere/notify', handlePayHereNotify);

module.exports = router;