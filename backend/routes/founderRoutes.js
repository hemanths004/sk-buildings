const express = require("express");
const router = express.Router();
const founderController = require("../controllers/founderController");
const { adminProtect } = require("../middleware/adminProtect");

// Public route for frontend to fetch about info (if needed)
router.get("/", founderController.getFounders);

// Admin routes
router.post("/", adminProtect, founderController.createFounder);
router.put("/:id", adminProtect, founderController.updateFounder);
router.delete("/:id", adminProtect, founderController.deleteFounder);

module.exports = router;
