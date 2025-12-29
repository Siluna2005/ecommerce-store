const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect); // All routes require authentication

router.post('/', createOrder);
router.get('/user', getUserOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/payment', protect, admin, updatePaymentStatus);

module.exports = router;