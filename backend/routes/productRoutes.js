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
