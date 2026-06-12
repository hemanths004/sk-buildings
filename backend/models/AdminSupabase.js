const supabase = require("../config/supabaseClient");

class AdminModel {
  // Create a new admin
  static async create(adminData) {
    const { data, error } = await supabase
      .from("admins")
      .insert([adminData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find admin by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find admin by email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Update admin
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("admins")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete admin
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("admins")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get all admins
  static async findAll() {
    const { data, error } = await supabase.from("admins").select("*");

    if (error) throw new Error(error.message);
    return data || [];
  }
}

module.exports = AdminModel;
