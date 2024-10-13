const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// POST /api/menu
router.post("/postmenu", async (req, res) => {
  try {
    const newMenuItem = new MenuItem(req.body);
    await newMenuItem.save();
    res.status(201).json({ message: "Menu item added successfully!", newMenuItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/getmenu", async (req, res) => {
    try {
      const menuItems = await MenuItem.find();
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
