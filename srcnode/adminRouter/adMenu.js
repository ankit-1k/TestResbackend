const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// POST /api/postmenu
router.post("/postmenu", async (req, res) => {
  try {
    const { category, items } = req.body;

    // Find the existing category
    let menuItem = await MenuItem.findOne({ category });

    if (menuItem) {
      // If the category exists, push the new item to the items array
      menuItem.items.push(...items);
    } else {
      // If the category doesn't exist, create a new menu item
      menuItem = new MenuItem({ category, items });
    }

    await menuItem.save();
    res.status(201).json({ message: "Menu item added successfully!", menuItem });
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
