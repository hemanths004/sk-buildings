const supabase = require("../config/supabaseClient");

class ProjectModel {
  // Create a new project
  static async create(projectData) {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Find project by ID with properties
  static async findById(id) {
    const { data, error } = await supabase
      .from("projects")
      .select("*, properties(*)")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }

  // Get all projects
  static async findAll() {
    const { data, error } = await supabase
      .from("projects")
      .select("*, properties(*)");

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Update project
  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("projects")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Delete project
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get projects by admin
  static async findByAdmin(adminId) {
    const { data, error } = await supabase
      .from("projects")
      .select("*, properties(*)")
      .eq("created_by", adminId);

    if (error) throw new Error(error.message);
    return data || [];
  }
}

module.exports = ProjectModel;
