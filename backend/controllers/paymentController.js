const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const Payment = require("../models/PaymentSupabase");
const Property = require("../models/PropertySupabase");
const Tenant = require("../models/TenantSupabase");
const supabase = require("../config/supabaseClient");

// 1. Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, tenantId, propertyId } = req.body;

    const options = {
      amount: amount * 100,    // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tenantId,
      propertyId,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Attempt to find booking for this property/tenant
    const { data: booking } = await supabase
      .from("bookings")
      .select("id")
      .eq("property_id", propertyId)
      .eq("tenant_id", tenantId)
      .single();

    // Save payment record
    const payment = await Payment.create({
      tenant_id: tenantId,
      booking_id: booking ? booking.id : null, // Fallback to null if no booking found, might violate NOT NULL
      amount,
      payment_method: "online",
      status: "completed",
      razorpay_payment_id,
      razorpay_order_id,
    });

    // Update property status -> booked (schema doesn't have sold)
    await Property.findByIdAndUpdate(propertyId, {
      status: "booked",
      // owner is handled via tenant_properties
    });

    // Add owned property to tenant
    await Tenant.addProperty(tenantId, propertyId);

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};