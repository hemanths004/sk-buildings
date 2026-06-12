const supabase = require("../config/supabaseClient");

class PaymentModel {
  // Create a new payment
  static async create(paymentData) {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find payment by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from("payments")
      .select("*, bookings(*), tenants(*)")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find payments by booking
  static async findByBooking(bookingId) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId);

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Find payments by tenant
  static async findByTenant(tenantId) {
    const { data, error } = await supabase
      .from("payments")
      .select("*, bookings(*)")
      .eq("tenant_id", tenantId);

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Find by Razorpay Order ID
  static async findByRazorpayOrderId(orderId) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", orderId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find by Razorpay Payment ID
  static async findByRazorpayPaymentId(paymentId) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_payment_id", paymentId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Update payment
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("payments")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete payment
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get all payments
  static async findAll(filters = {}) {
    let query = supabase.from("payments").select("*");

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }
}

module.exports = PaymentModel;
