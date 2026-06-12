const supabase = require("../config/supabaseClient");

class BookingModel {
  // Create a new booking
  static async create(bookingData) {
    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find booking by ID with related data
  static async findById(id) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, properties(*), tenants(*)")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find all bookings
  static async findAll(filters = {}) {
    let query = supabase
      .from("bookings")
      .select("*, properties(*), tenants(*)");

    if (filters.property_id) {
      query = query.eq("property_id", filters.property_id);
    }
    if (filters.tenant_id) {
      query = query.eq("tenant_id", filters.tenant_id);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Update booking
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete booking
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get bookings by tenant
  static async findByTenant(tenantId) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, properties(*)")
      .eq("tenant_id", tenantId);

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Get bookings by property
  static async findByProperty(propertyId) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, tenants(*)")
      .eq("property_id", propertyId);

    if (error) throw new Error(error.message);
    return data || [];
  }
}

module.exports = BookingModel;
