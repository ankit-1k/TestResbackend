// models/MenuItem.js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  items: [
    {
      img: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
    },
  ],
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
