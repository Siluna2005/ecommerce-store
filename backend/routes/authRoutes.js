const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.use(protect); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/address', addAddress);
router.put('/address/:addressId', updateAddress);
router.delete('/address/:addressId', deleteAddress);

module.exports = router;


// ===============================================
// FILE: backend/routes/productRoutes.js
// ===============================================
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

router.use(protect); // Authentication required
router.use(admin); // Admin only

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;