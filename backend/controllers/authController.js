const Tenant = require("../models/TenantSupabase");
const { generateOTP } = require("../utils/otpGenerator");
const { generateToken } = require("../utils/jwt");

// In-memory OTP store (DEV ONLY)
const otpStore = {};

// =======================
// SEND OTP
// =======================
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = generateOTP();
    otpStore[phone] = otp;

    console.log(`OTP for ${phone} is ${otp}`);

    const tenant = await Tenant.findByPhone(phone);
    if (!tenant) {
      // Return 404 so frontend knows to show registration, but still supply OTP in dev mode
      return res.status(404).json({
        message: "Phone number not registered. Please sign up.",
        otp: otp
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      otp: otp
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// VERIFY OTP
// =======================
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    if (otpStore[phone] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let tenant = await Tenant.findByPhone(phone);

    if (!tenant) {
      // If verify is called directly, auto-create
      tenant = await Tenant.create({ phone, name: "Tenant " + phone.slice(-4) });
    }

    delete otpStore[phone];

    // Note: generateToken might expect _id if it hasn't been updated, 
    // but we can pass tenant and let it use tenant.id
    tenant._id = tenant.id; // temporary compat
    const token = generateToken(tenant);

    const user = {
      id: tenant.id,
      _id: tenant.id, // temporary for frontend compat during migration
      name: tenant.name || "Tenant",
      phone: tenant.phone,
      email: tenant.email || "",
      role: "user",
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      tenant,
      user
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// REGISTER NEW USER
// =======================
const register = async (req, res) => {
  try {
    const { name, phone, email, otp } = req.body;

    if (!name || !phone || !otp) {
      return res.status(400).json({ message: "Name, Phone, and OTP are required" });
    }

    if (otpStore[phone] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let tenant = await Tenant.findByPhone(phone);

    if (tenant) {
      tenant = await Tenant.findByIdAndUpdate(tenant.id, { 
        name, 
        email: email || tenant.email 
      });
    } else {
      tenant = await Tenant.create({ name, phone, email });
    }

    delete otpStore[phone];

    tenant._id = tenant.id; // temporary compat
    const token = generateToken(tenant);

    const user = {
      id: tenant.id,
      _id: tenant.id,
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email || "",
      role: "user",
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    };

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      token,
      tenant,
      user
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  register
};