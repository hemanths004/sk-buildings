const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSupabase");

exports.adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing. Not authorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // 🔥 FETCH FULL ADMIN DOCUMENT
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // 🔥 NOW req.admin HAS _id
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin protect error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};