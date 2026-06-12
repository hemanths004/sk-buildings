const express = require("express");
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updatePropertyStatus,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const { adminProtect } = require("../middleware/adminProtect");

// =====================================
// ADMIN ROUTES
// =====================================

// Create property
router.post("/create", adminProtect, createProperty);

// Update property details (including status, price, etc.)
router.put("/:id", adminProtect, updateProperty);

// Update property status only
router.put("/status/:id", adminProtect, updatePropertyStatus);

// Delete property
router.delete("/:id", adminProtect, deleteProperty);

// =====================================
// PUBLIC / TENANT ROUTES
// =====================================

// View all properties
router.get("/all", getAllProperties);

// View single property
router.get("/:id", getPropertyById);

module.exports = router;