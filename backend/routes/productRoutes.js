const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
<<<<<<< HEAD
router.post('/', protect, authorize('admin'), addProduct);
=======
router.post('/', protect, authorize('admin', 'customer'), addProduct);
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
