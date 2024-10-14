const express = require("express");
const orderRouter = express.Router();
const Order = require("../schema/Order");
const DeletedOrder = require("../models/DeletedOrder");

orderRouter.post("/order", async (req, res) => {
  try {
    const { name, table, items, total } = req.body;
    const newOrder = new Order({
      name,
      table,
      items,
      total,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

orderRouter.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});
orderRouter.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order to delete
    const orderToDelete = await Order.findById(orderId);
    if (!orderToDelete) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Save the order to DeletedOrder collection before deletion
    const deletedOrder = new DeletedOrder(orderToDelete.toObject());
    await deletedOrder.save();

    // Now delete the order from the original collection
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});
module.exports = orderRouter;
