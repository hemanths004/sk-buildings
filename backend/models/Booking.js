const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      unique: true, // 🔒 prevents double booking
    },
    amount: {
      type: Number,
      required: true,
    },
    moveInDate: {
      type: Date,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    rentAmount: {
      type: Number,
    },
    rentDueDate: {
      type: Number, // day of month (1-31)
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["aadhaar", "agreement"],
        },
        name: String,
        url: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);