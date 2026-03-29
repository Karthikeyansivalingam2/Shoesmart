const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
<<<<<<< HEAD
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
=======
        product: { type: String },
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
<<<<<<< HEAD
    paymentMethod: { type: String, enum: ['COD', 'UPI'], required: true },
    status: {
        type: String,
        enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
        default: 'Placed'
    },
=======
    paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
    status: {
        type: String,
        enum: ['Pending', 'Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date },
    deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
