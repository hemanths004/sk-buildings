const supabase = require("../config/supabaseClient");

class PropertyModel {
  // Create a new property
  static async create(propertyData) {
    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find property by ID with project details
  static async findById(id) {
    const { data, error } = await supabase
      .from("properties")
      .select("*, projects(*)")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Find all properties
  static async findAll(filters = {}) {
    let query = supabase.from("properties").select("*, projects(*)");

    if (filters.project_id) {
      query = query.eq("project_id", filters.project_id);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Find available properties
  static async findAvailable(limit = 100, offset = 0) {
    const { data, error, count } = await supabase
      .from("properties")
      .select("*, projects(*)", { count: "exact" })
      .eq("status", "available")
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { data, count };
  }

  // Update property
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("properties")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete property
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get properties by project
  static async findByProject(projectId) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("project_id", projectId);

    if (error) throw new Error(error.message);
    return data || [];
  }
}

module.exports = PropertyModel;
