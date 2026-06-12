const Project = require("../models/ProjectSupabase");
const Property = require("../models/PropertySupabase");
const supabase = require("../config/supabaseClient"); // for custom queries if needed

/* ===============================
   CREATE PROJECT (ADMIN)
=============================== */
exports.createProject = async (req, res) => {
  try {
    const { name, location, map_lat, map_lng, description, images, status, numberOfFlats, flatPrice, flatAdvance, flatType, numberOfShops, shopPrice, shopAdvance, shopLength, shopWidth, pricing_rules, flatConfigs } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Project name and location are required",
      });
    }

    // Check existing project
    const { data: existingProject } = await supabase
      .from("projects")
      .select("*")
      .eq("name", name)
      .single();

    if (existingProject) {
      return res.status(400).json({
        message: "Project already exists",
      });
    }

    const adminId = req.admin ? (req.admin.id || req.admin._id) : null;

    const project = await Project.create({
      name,
      location,
      map_lat,
      map_lng,
      description,
      images: images || [],
      status: status || 'active',
      pricing_rules: pricing_rules || {},
      created_by: adminId,
    });

    // Bulk create properties if requested
    const newProperties = [];
    let flatIndex = 1;
    if (flatConfigs && Array.isArray(flatConfigs)) {
      for (const config of flatConfigs) {
        if (config.count > 0) {
          for (let i = 0; i < config.count; i++) {
            newProperties.push({
              title: `Flat ${flatIndex++}`,
              type: 'flat',
              project_id: project.id,
              price: config.price || 0,
              advance: config.advance || 0,
              unit_type: config.type || '1bhk',
              status: 'available',
              created_by: adminId
            });
          }
        }
      }
    } else if (numberOfFlats > 0) {
      for (let i = 1; i <= numberOfFlats; i++) {
        newProperties.push({
          title: `Flat ${flatIndex++}`,
          type: 'flat',
          project_id: project.id,
          price: flatPrice || 0,
          advance: flatAdvance || 0,
          unit_type: flatType || '1bhk',
          status: 'available',
          created_by: adminId
        });
      }
    }
    const calculatedShopArea = (shopLength && shopWidth) ? (Number(shopLength) * Number(shopWidth)) : null;
    if (numberOfShops > 0) {
      for (let i = 1; i <= numberOfShops; i++) {
        newProperties.push({
          title: `Shop ${i}`,
          type: 'shop',
          project_id: project.id,
          price: shopPrice || 0,
          advance: shopAdvance || 0,
          size_sqft: calculatedShopArea,
          status: 'available',
          created_by: adminId
        });
      }
    }

    if (newProperties.length > 0) {
      const { error: insertError } = await supabase.from('properties').insert(newProperties);
      if (insertError) {
        console.error("Bulk Property Insert Error:", insertError);
      }
    }

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL PROJECTS (ADMIN / PUBLIC)
=============================== */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll(); // Custom wrapper method
    return res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   PROJECT → PROPERTY BREAKDOWN (ADMIN)
=============================== */
exports.getProjectPropertyBreakdown = async (req, res) => {
  try {
    const projects = await Project.findAll();

    const breakdown = await Promise.all(
      projects.map(async (project) => {
        const properties = await Property.findByProject(project.id); // Custom wrapper method

        const totalProperties = properties.length;
        const availableProperties = properties.filter(
          (p) => p.status === "available"
        ).length;
        const bookedProperties = properties.filter(
          (p) => p.status === "booked"
        ).length;

        return {
          projectId: project.id,
          projectName: project.name,
          location: project.location,
          totalProperties,
          availableProperties,
          bookedProperties,
          properties,
        };
      })
    );

    return res.status(200).json({
      count: breakdown.length,
      projects: breakdown,
    });
  } catch (error) {
    console.error("Project Breakdown Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE PROJECT (ADMIN)
=============================== */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, map_lat, map_lng, description, images, status, flatPrice, shopPrice, flatAdvance, shopAdvance, pricing_rules } = req.body;

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (location !== undefined) updateFields.location = location;
    if (map_lat !== undefined) updateFields.map_lat = map_lat;
    if (map_lng !== undefined) updateFields.map_lng = map_lng;
    if (description !== undefined) updateFields.description = description;
    if (images !== undefined) updateFields.images = images;
    if (status !== undefined) updateFields.status = status;
    if (pricing_rules !== undefined) updateFields.pricing_rules = pricing_rules;

    const updatedProject = await Project.findByIdAndUpdate(id, updateFields);

    // Bulk update flat prices if provided
    if (flatPrice !== undefined && flatPrice !== null) {
      await supabase
        .from('properties')
        .update({ price: flatPrice })
        .eq('project_id', id)
        .eq('type', 'flat');
    }

    // Bulk update shop prices if provided
    if (shopPrice !== undefined && shopPrice !== null) {
      await supabase
        .from('properties')
        .update({ price: shopPrice })
        .eq('project_id', id)
        .eq('type', 'shop');
    }

    // Bulk update flat advance if provided
    if (flatAdvance !== undefined && flatAdvance !== null) {
      await supabase
        .from('properties')
        .update({ advance: flatAdvance })
        .eq('project_id', id)
        .eq('type', 'flat');
    }

    // Bulk update shop advance if provided
    if (shopAdvance !== undefined && shopAdvance !== null) {
      await supabase
        .from('properties')
        .update({ advance: shopAdvance })
        .eq('project_id', id)
        .eq('type', 'shop');
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE PROJECT (ADMIN)
=============================== */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if project has properties
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (existingProject.properties && existingProject.properties.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete project with existing properties. Please remove properties first." 
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete Project Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};