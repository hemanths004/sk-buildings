const jwt = require("jsonwebtoken");
const Tenant = require("../models/TenantSupabase");
const Admin = require("../models/AdminSupabase");

const protect = async (req, res, next) => {
  try {
    let token;

    // Expect: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find tenant
    const tenant = await Tenant.findById(decoded.id);

    if (!tenant) {
      return res.status(401).json({ message: "Tenant not found" });
    }

    // ✅ Attach logged-in tenant to request
    req.user = tenant;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

const protectEither = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try Tenant
    const tenant = await Tenant.findById(decoded.id);
    if (tenant) {
      req.user = tenant;
      return next();
    }

    // Try Admin
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.admin = admin;
      req.user = admin; // Attach to user as fallback
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    console.error("Auth Either Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { protect, protectEither };