const express = require("express");
const router = express.Router();

const { adminLogin, adminGoogleLogin } = require("../controllers/adminAuthController");

// Admin login
router.post("/login", adminLogin);
router.post("/google", adminGoogleLogin);

module.exports = router;