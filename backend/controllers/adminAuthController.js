const Admin = require("../models/AdminSupabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Admin login only allowed for specific email
  if (username !== "skbuildings.whitefield@gmail.com") {
    return res.status(403).json({ message: "Access denied. Not an authorized admin email." });
  }

  // Assume username is email for admin in SQL schema
  const admin = await Admin.findByEmail(username);
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: admin.id, role: "admin" }, // role was hardcoded or in schema
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "Admin login success", token });
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.adminGoogleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "No Google credential provided." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    if (email !== "skbuildings.whitefield@gmail.com") {
      return res.status(403).json({ message: "Access denied. Not an authorized admin email." });
    }

    let admin = await Admin.findByEmail(email);
    if (!admin) {
      // Auto-create the admin user for the authorized email
      console.log("Admin not found, auto-creating...");
      admin = await Admin.create({
        email: email,
        password_hash: "google-oauth-no-password",
        name: "SK Buildings Admin"
      });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Google Admin login success", token });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};