const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  register,
} = require("../controllers/authController");

// =======================
// AUTH ROUTES
// =======================

// Send OTP to phone number
router.post("/send-otp", sendOtp);

// Verify OTP and login
router.post("/verify-otp", verifyOtp);

// Register a new tenant
router.post("/register", register);

module.exports = router;