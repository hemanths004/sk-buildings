const supabase = require("../config/supabaseClient");

class TenantModel {
  // Create a new tenant
  static async create(tenantData) {
    const { data, error } = await supabase
      .from("tenants")
      .insert([tenantData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find tenant by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find tenant by phone
  static async findByPhone(phone) {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Get all tenants
  static async findAll(limit = 100, offset = 0) {
    const { data, error, count } = await supabase
      .from("tenants")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { data, count };
  }

  // Update tenant
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("tenants")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete tenant
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("tenants")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get tenant's properties
  static async getTenantProperties(tenantId) {
    const { data, error } = await supabase
      .from("tenant_properties")
      .select("properties(*)")
      .eq("tenant_id", tenantId);

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Add property to tenant
  static async addProperty(tenantId, propertyId) {
    const { data, error } = await supabase
      .from("tenant_properties")
      .insert([{ tenant_id: tenantId, property_id: propertyId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = TenantModel;
