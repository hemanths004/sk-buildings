const express = require("express");
const router = express.Router();

const { protect, protectEither } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminProtect");
const upload = require("../utils/fileStorage");

const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  uploadBookingDocument,
  getAllBookings,
} = require("../controllers/bookingController");

// =====================================
// ROUTE CONFIGURATION
// Base URL: /bookings (or /booking)
// =====================================

// Create a new booking request (Tenant only)
router.post("/", protect, createBooking);
router.post("/create", protect, createBooking); // backward compatibility alias

// Get user's own bookings list (Tenant only)
router.get("/my-bookings", protect, getUserBookings);

// Get all bookings list (Admin only)
router.get("/", adminProtect, getAllBookings);

// Get details of a single booking (Tenant or Admin)
router.get("/:id", protectEither, getBookingById);

// Update status of a booking (Admin only)
router.patch("/:id/status", adminProtect, updateBookingStatus);
router.patch("/status/:id", adminProtect, updateBookingStatus); // backward compatibility alias

// Upload booking document (Tenant or Admin)
router.post("/:id/documents", protectEither, upload.single("document"), uploadBookingDocument);

module.exports = router;