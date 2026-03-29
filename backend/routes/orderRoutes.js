const express = require('express');
const {
    createOrder,
<<<<<<< HEAD
=======
    verifyPayment,
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    assignDelivery,
    getAdminStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
<<<<<<< HEAD
=======
router.post('/verify-payment', protect, verifyPayment);
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.put('/:id/status', protect, authorize('admin', 'delivery'), updateOrderStatus);
router.put('/:id/assign', protect, authorize('admin'), assignDelivery);

module.exports = router;
