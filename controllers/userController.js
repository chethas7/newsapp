// controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

//LOGOUT

// JWT token blacklist (simulating in-memory storage)
const tokenBlacklist = new Set();

const logoutUser = async (req, res) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization.split(" ")[1];

    // Add the token to the blacklist (for token invalidation)
    tokenBlacklist.add(token);

    // Optionally, you can also remove the token from the user's record in the database
    // For example: await User.findByIdAndUpdate(req.user._id, { $pull: { tokens: token } });

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error logging out.", error });
  }
};

//////////////////////////////////////////////Create Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new User({
      username,
      password: hashedPassword,
      isAdmin: true,
    });

    // Save the admin user to the database
    await newAdmin.save();

    res.status(201).json({ message: "Admin user created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error creating admin user." });
  }
};

module.exports = { registerUser, loginUser, registerAdmin, logoutUser };
