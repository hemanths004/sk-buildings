const Property = require("../models/PropertySupabase");
const Project = require("../models/ProjectSupabase");
const Booking = require("../models/BookingSupabase");
const supabase = require("../config/supabaseClient");

/**
 * =====================================
 * ADMIN: CREATE PROPERTY (FLAT / SHOP)
 * POST /admin/property/create
 * =====================================
 */
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      type,
      projectId,
      price,
      advance,
      floor,
      sizeSqFt,
      description,
      tenantName,
      tenantPhone,
      advancePaidDate,
      advancePaid,
      rentPaid,
      unit_type,
    } = req.body;

    // Basic validation
    if (!title || !type || !projectId || !price) {
      return res.status(400).json({
        message: "title, type, projectId, and price are required",
      });
    }

    // Validate project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create property
    const property = await Property.create({
      title,
      type, // "flat", "shop", or "office"
      project_id: projectId,
      price,
      advance: advance || 0,
      floor,
      size_sqft: sizeSqFt,
      description,
      images: req.body.images || [],
      tenant_name: tenantName || null,
      tenant_phone: tenantPhone || null,
      advance_paid_date: advancePaidDate || null,
      advance_paid: advancePaid || 0,
      rent_paid: rentPaid || 0,
      unit_type: unit_type || null,
      created_by: req.admin ? req.admin.id || req.admin._id : null,
    });

    return res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create Property Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * GET ALL PROPERTIES (PUBLIC / TENANT)
 * GET /admin/property/all
 * =====================================
 */
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll(); // includes projects(*)

    // Map projects(*) array back to a single project object for frontend compatibility if needed
    const mappedProperties = properties.map(p => ({
      ...p,
      project: p.projects && p.projects.length > 0 ? p.projects[0] : p.projects
    }));

    return res.status(200).json({
      count: mappedProperties.length,
      properties: mappedProperties,
    });
  } catch (error) {
    console.error("Get Properties Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * GET PROPERTY BY ID (PUBLIC / TENANT)
 * GET /admin/property/:id
 * =====================================
 */
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.project = property.projects; // compat

    return res.status(200).json({ property });
  } catch (error) {
    console.error("Get Property By ID Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE PROPERTY STATUS
 * PUT /admin/property/status/:id
 * =====================================
 */
exports.updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "booked", "rented"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const property = await Property.findByIdAndUpdate(id, { status });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({
      message: "Property status updated",
      property,
    });
  } catch (error) {
    console.error("Update Property Status Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE PROPERTY DETAILS
 * PUT /admin/property/:id
 * =====================================
 */
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      type, 
      price, 
      advance, 
      status, 
      images, 
      project_id, 
      floor, 
      sizeSqFt,
      tenantName,
      tenantPhone,
      advancePaidDate,
      advancePaid,
      rentPaid,
      tenantAadharFile,
      tenantAgreementFile,
      unit_type
    } = req.body;

    // Validate if status is valid
    if (status && !["available", "booked", "rented"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Validate type
    if (type && !["flat", "shop", "office"].includes(type)) {
      return res.status(400).json({ message: "Invalid property type" });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (type !== undefined) updateFields.type = type;
    if (price !== undefined) updateFields.price = Number(price);
    if (advance !== undefined) updateFields.advance = Number(advance);
    if (status !== undefined) updateFields.status = status;
    if (images !== undefined) updateFields.images = images;
    if (project_id !== undefined) updateFields.project_id = project_id;
    if (floor !== undefined) updateFields.floor = Number(floor);
    if (sizeSqFt !== undefined) updateFields.size_sqft = Number(sizeSqFt);
    if (tenantName !== undefined) updateFields.tenant_name = tenantName;
    if (tenantPhone !== undefined) updateFields.tenant_phone = tenantPhone;
    if (advancePaidDate !== undefined) {
      updateFields.advance_paid_date = advancePaidDate === "" ? null : advancePaidDate;
    }
    if (advancePaid !== undefined) updateFields.advance_paid = Number(advancePaid);
    if (rentPaid !== undefined) updateFields.rent_paid = Number(rentPaid);
    if (tenantAadharFile !== undefined) updateFields.tenant_aadhar_file = tenantAadharFile;
    if (tenantAgreementFile !== undefined) updateFields.tenant_agreement_file = tenantAgreementFile;
    if (unit_type !== undefined) updateFields.unit_type = unit_type;

    const property = await Property.findByIdAndUpdate(id, updateFields);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Update Property Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: DELETE PROPERTY
 * DELETE /admin/property/:id
 * =====================================
 */
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete any bookings associated with this property to avoid FK constraint errors
    await supabase.from("bookings").delete().eq("property_id", id);

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};