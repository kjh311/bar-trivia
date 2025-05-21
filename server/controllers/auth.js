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

// NEW: Endpoint to get a user's high score (for fetching)
router.get("/high-score", verifyToken, async (req, res) => {
  // Assuming verifyToken middleware adds req.userId
  const userId = req.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User ID not found in token." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ highScore: user.highScore });
  } catch (err) {
    console.error("Error fetching high score:", err);
    res.status(500).json({ error: err.message });
  }
});

// NEW: Endpoint to update user's high score (for posting)
router.post("/update-high-score", verifyToken, async (req, res) => {
  const { newScore } = req.body;
  const userId = req.userId; // This comes from the verifyToken middleware

  if (typeof newScore !== "number" || newScore < 0) {
    // Validate newScore is a non-negative number
    return res
      .status(400)
      .json({
        message: "Invalid score provided. Must be a non-negative number.",
      });
  }

  try {
    // Find the user by the ID from the token (most secure way for authenticated users)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update highScore only if the newScore is greater than the current highScore
    if (newScore > user.highScore) {
      user.highScore = newScore;
      await user.save(); // Save the updated user document
      console.log(
        `High score for ${user.name} (ID: ${userId}) updated to: ${user.highScore}`
      );
      res
        .status(200)
        .json({
          message: "High score updated successfully!",
          user: { id: user._id, name: user.name, highScore: user.highScore },
        });
    } else {
      console.log(
        `New score (${newScore}) is not higher than current high score (${user.highScore}) for ${user.name}. No update needed.`
      );
      res
        .status(200)
        .json({
          message:
            "New score is not higher than current high score. No update needed.",
          user: { id: user._id, name: user.name, highScore: user.highScore },
        });
    }
  } catch (err) {
    console.error("Error updating high score:", err);
    res.status(500).json({ error: err.message });
  }
});

// Protected Routes
router.get("/gameRoom", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your game room" });
});

export default router;
