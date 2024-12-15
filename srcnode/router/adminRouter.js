const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

const SECRET_KEY = 'secretkey123'; // Make sure to use a secure key in production

// Admin Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("Received username:", username); // Debugging log
  console.log("Received password:", password); // Debugging log

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find the admin in the database
    const admin = await Admin.findOne({ username });
    console.log('Found Admin:', admin);  // Debugging log

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: '1s' });
    console.log('Generated Token:', token);  // Debugging log

    // Respond with success and the token
    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token: token,  // Ensure token is included here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Token Validation Route
router.get("/validate", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
      // Extract token from 'Bearer <token>'
      const tokenWithoutBearer = token.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);
      console.log("Token validated, user:", decoded);  // Debugging log
      res.json({ valid: true, user: decoded });
  } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ message: "Invalid token" });
  }
});



module.exports = router;
