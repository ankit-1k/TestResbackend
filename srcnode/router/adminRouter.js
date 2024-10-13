const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../schema/adminModel'); // Your admin schema
const router = express.Router();

// Admin registration route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });

    // Save the new admin to the database
    await newAdmin.save();
    res.status(201).json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    // Admin login successful
    res.json({ success: true, message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
