const express = require("express");
const router = express.Router();
const { sendRentReminders } = require("../controllers/rentReminderController");

router.get("/test-reminder", async (req, res) => {
  await sendRentReminders();
  res.json({ message: "Test reminder triggered" });
});

module.exports = router;