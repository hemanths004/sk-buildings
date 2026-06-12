const supabase = require("../config/supabaseClient");

class FounderModel {
  static async create(founderData) {
    const { data, error } = await supabase
      .from("founders")
      .insert([founderData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from("founders")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from("founders")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("founders")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = FounderModel;
