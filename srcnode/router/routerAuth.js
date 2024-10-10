const express = require("express");
const routerAuth = express.Router();
const User = require("../schema/User");
const bcrypt = require("bcryptjs"); 

routerAuth.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Error in registration");
  }
});

routerAuth.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(400).send("Invalid email or password");
      }
  
      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password mismatch");
        return res.status(400).send("Invalid email or password");
      }
  
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.log("Server error:", error);
      res.status(500).send("Server error");
    }
  });
  

    

module.exports = routerAuth;
