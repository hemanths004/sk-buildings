const express = require("express");
const router = express.Router();

const { createOrder, verifyPayment } = require("../controllers/paymentController");

// create Razorpay order
router.post("/order", createOrder);

// verify Razorpay signature
router.post("/verify", verifyPayment);

module.exports = router;