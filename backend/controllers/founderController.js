const Founder = require("../models/FounderSupabase");

exports.getFounders = async (req, res) => {
  try {
    const founders = await Founder.findAll();
    res.json(founders);
  } catch (error) {
    console.error("Get Founders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createFounder = async (req, res) => {
  try {
    const { name, role, qualification, image_url } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const founder = await Founder.create({
      name,
      role,
      qualification,
      image_url
    });

    res.status(201).json(founder);
  } catch (error) {
    console.error("Create Founder Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFounder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, qualification, image_url } = req.body;
    
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (role !== undefined) updateFields.role = role;
    if (qualification !== undefined) updateFields.qualification = qualification;
    if (image_url !== undefined) updateFields.image_url = image_url;

    const founder = await Founder.findByIdAndUpdate(id, updateFields);
    res.json(founder);
  } catch (error) {
    console.error("Update Founder Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFounder = async (req, res) => {
  try {
    const { id } = req.params;
    await Founder.findByIdAndDelete(id);
    res.json({ message: "Founder deleted" });
  } catch (error) {
    console.error("Delete Founder Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
