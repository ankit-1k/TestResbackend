const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

const SECRET_KEY = 'secretkey123'; // Use a secure key in production

// Admin Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token: token, // Include token in response
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Token Validation Route
router.get("/validate", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const tokenWithoutBearer = token.split(" ")[1]; // Extract token from 'Bearer <token>'
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
