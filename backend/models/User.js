const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'admin', 'delivery'],
        default: 'customer'
    },
    phone: { type: String },
<<<<<<< HEAD
    addresses: [{
        type: { type: String, default: 'Home' },
        address: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }],
=======
    address: { type: String },
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14
    avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
