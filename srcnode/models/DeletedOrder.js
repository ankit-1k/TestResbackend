const mongoose = require('mongoose');

const DeletedOrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    table: { type: Number, required: true },
    items: [{ img: String, name: String, price: Number }],
    total: { type: Number, required: true },
    deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeletedOrder', DeletedOrderSchema);
