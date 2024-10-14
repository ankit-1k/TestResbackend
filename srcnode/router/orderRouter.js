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
orderRouter.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
orderRouter.put('/orders/:id', async (req, res) => {
  const { name, table, items, total } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { name, table, items, total },
      { new: true, runValidators: true } // new: true returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = orderRouter;
