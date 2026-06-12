const express = require("express");
const router = express.Router();

const {
  getAllTenants,
  getAllBookings,
  getAdminDashboard,
  updateTenant,
} = require("../controllers/adminController");

const { adminProtect } = require("../middleware/adminProtect");

/* ===============================
   ADMIN DATA ROUTES
   Base URL: /admin/data
=============================== */

// Dashboard stats (counts + project-wise income)
router.get("/dashboard", adminProtect, getAdminDashboard);

// Get all tenants
router.get("/tenants", adminProtect, getAllTenants);

// Update tenant details
router.put("/tenants/:id", adminProtect, updateTenant);

// Get all bookings
router.get("/bookings", adminProtect, getAllBookings);

module.exports = router;