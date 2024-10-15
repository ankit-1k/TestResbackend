const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// POST /api/postmenu
router.post("/postmenu", async (req, res) => {
  try {
    const { category, items } = req.body;

    let menuItem = await MenuItem.findOne({ category });

    if (menuItem) {
      menuItem.items.push(...items);
    } else {
      menuItem = new MenuItem({ category, items });
    }

    await menuItem.save();
    res
      .status(201)
      .json({ message: "Menu item added successfully!", menuItem });
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
// DELETE /api/deletemenu/:id
router.delete("/deletemenu/:id/:itemIndex", async (req, res) => {
  try {
    const { id, itemIndex } = req.params;

    const menuItem = await MenuItem.findById(id);
    if (menuItem) {
      menuItem.items.splice(itemIndex, 1); // Remove item by index
      await menuItem.save();
      return res
        .status(200)
        .json({ message: "Menu item deleted successfully!" });
    }
    res.status(404).json({ message: "Menu item not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT /api/updatemenu/:id/:itemIndex
router.put("/updatemenu/:id/:itemIndex", async (req, res) => {
  try {
    const { id, itemIndex } = req.params;
    const { img, name, message, price } = req.body;

    const menuItem = await MenuItem.findById(id);
    if (menuItem) {
      menuItem.items[itemIndex] = { img, name, message, price }; // Update the specific item
      await menuItem.save();
      return res
        .status(200)
        .json({ message: "Menu item updated successfully!", menuItem });
    }
    res.status(404).json({ message: "Menu item not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
