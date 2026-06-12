const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
    },

    // Aadhaar & agreement (stored via storage controller)
    aadhaarUrl: {
      type: String,
    },

    agreementUrl: {
      type: String,
    },

    // Properties owned / booked by tenant
    ownedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // Rent system
    rentDueDate: {
      type: Date,
    },

    rentAmount: {
      type: Number,
    },

    rentDueDay: {
      type: Number, // day of month (1-31)
    },
  },
  {
    timestamps: true, // ✅ replaces createdAt
  }
);

module.exports = mongoose.model("Tenant", tenantSchema);