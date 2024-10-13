const express = require('express');
const orderRouter = express.Router();
const Order = require('../schema/Order');

orderRouter.post('/order', async (req, res) => {
  try {
    const { name, table, items, total } = req.body;
    const newOrder = new Order({
      name,
      table,
      items,
      total,
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

orderRouter.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = orderRouter;
