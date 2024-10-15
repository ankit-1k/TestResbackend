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
router.delete("/deletemenu/:category/:itemIndex", async (req, res) => {
  const { category, itemIndex } = req.params;

  try {
    const menuItem = await MenuItem.findOne({ category });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu category not found." });
    }

    // Check if the item index is valid
    if (itemIndex < 0 || itemIndex >= menuItem.items.length) {
      return res.status(400).json({ message: "Invalid item index." });
    }

    // Remove the item at the specified index
    menuItem.items.splice(itemIndex, 1);

    await menuItem.save();
    res.status(200).json({ message: "Menu item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error." });
  }
});
// PUT /api/updatemenu/:id/:itemIndex
// PUT /api/updatemenu/:category/:itemIndex
router.put("/updatemenu/:category/:itemIndex", async (req, res) => {
  const { category, itemIndex } = req.params;
  const { img, name, message, price } = req.body;

  try {
    const menuItem = await MenuItem.findOne({ category });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu category not found." });
    }

    // Check if the item index is valid
    if (itemIndex < 0 || itemIndex >= menuItem.items.length) {
      return res.status(400).json({ message: "Invalid item index." });
    }

    // Update the item at the specified index
    menuItem.items[itemIndex] = { img, name, message, price };
    await menuItem.save();

    res.status(200).json({ message: "Menu item updated successfully!", menuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
