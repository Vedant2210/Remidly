import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("User exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  await user.save();
  res.json("Signup successful");
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json("Invalid credentials");

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

export default router;
