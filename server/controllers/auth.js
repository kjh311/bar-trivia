import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//REGISTER NEW USER
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser)
      return res.status(409).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      password: hashedPassword,
      highScore: "0", // Explicitly set the initial highScore
      friends: [],
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: newUser._id, name: newUser.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // After user is created:
});

// Login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected Routes
router.get("/gameRoom", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your game room" });
});

export default router;
