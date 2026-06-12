const jwt = require("jsonwebtoken");

const generateToken = (tenant) => {
  return jwt.sign(
    { id: tenant._id, phone: tenant.phone },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};