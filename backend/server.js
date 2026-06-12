const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/* =========================
   PUBLIC ROUTES (NO AUTH)
========================= */

// Health check
app.get("/", (req, res) => {
  res.status(200).send("SK Buildings Backend is running");
});

// Auth routes (OTP login)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

/* =========================
   ADMIN ROUTES
========================= */
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const projectRoutes = require("./routes/projectRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const adminDataRoutes = require("./routes/adminDataRoutes");
const founderRoutes = require("./routes/founderRoutes");

app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/projects", projectRoutes);
app.use("/admin/property", propertyRoutes);
app.use("/admin/data", adminDataRoutes);
app.use("/admin/founders", founderRoutes);

/* =========================
   TENANT / BUSINESS ROUTES
========================= */
const uploadRoutes = require("./routes/uploadRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const rentRoutes = require("./routes/rentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/upload", uploadRoutes);
app.use("/bookings", bookingRoutes); // Plural matching frontend
app.use("/booking", bookingRoutes);  // Singular for backward compatibility
app.use("/tenant", tenantRoutes);
app.use("/rent", rentRoutes);
app.use("/payment", paymentRoutes);

/* =========================
   CRON JOBS
========================= */
const {
  sendRentReminders,
} = require("./controllers/rentReminderController");

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily rent reminder job...");
  await sendRentReminders();
});

/* =========================
   DATABASE CONNECTION
========================= */
// Removed Mongoose, using Supabase client in controllers.
console.log("Supabase Client initialized in controllers");

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});