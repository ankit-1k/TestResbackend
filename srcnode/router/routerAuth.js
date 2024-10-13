const express = require("express");
const routerAuth = express.Router();
const User = require("../schema/User");
// const bcrypt = require("bcryptjs"); 
routerAuth.post("/register", async (req, res) => {
  const { username, email,phone, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const newUser = new User({ username, email,phone, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Error in registration");
  }
});

routerAuth.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  console.log(user)
  res.status(200).json({ 
    message: 'Login successful',
    user: {
      username: user.username,
      email: user.email,
    }
  });
});

module.exports = routerAuth;
