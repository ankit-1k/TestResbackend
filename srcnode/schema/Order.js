const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  table: { type: Number, required: true },
  items: [
    {
      name: String,
      price: Number,
    },
  ],
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
