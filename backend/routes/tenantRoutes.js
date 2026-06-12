const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { getMyProperties } = require("../controllers/tenantController");
const {
  getAvailableProperties,
} = require("../controllers/tenantPropertyController");

// ===============================
// TENANT ROUTES
// Base path: /tenant
// ===============================

// View all available properties (for browsing)
router.get("/properties", protect, getAvailableProperties);

// View properties booked/owned by this tenant
router.get("/my-properties", protect, getMyProperties);

module.exports = router;