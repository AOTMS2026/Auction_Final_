const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { requireAuth } = require("../middleware/requireAuth");

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const MAX_AVATAR_LENGTH = 4_000_000;

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    avatar: user.avatar ?? null,
  };
}

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/signup", asyncHandler(async (req, res) => {
  return res.status(403).json({ error: "Registration is disabled. Please use your provided franchise credentials." });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ token: signToken(user), user: toPublicUser(user) });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  res.json({ user: toPublicUser(user) });
}));

router.patch("/me", requireAuth, asyncHandler(async (req, res) => {
  const { name, avatar } = req.body ?? {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length > 80)) {
    return res.status(400).json({ error: "name must be a string up to 80 characters" });
  }
  if (avatar !== undefined && avatar !== null && (typeof avatar !== "string" || avatar.length > MAX_AVATAR_LENGTH)) {
    return res.status(400).json({ error: "avatar must be a base64 string under the size limit" });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (name !== undefined) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar ?? undefined;

  await user.save();
  res.json({ user: toPublicUser(user) });
}));

module.exports = router;
