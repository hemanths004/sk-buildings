const Property = require("../models/PropertySupabase");

/**
 * TENANT: View all available properties
 * GET /tenant/properties
 */
exports.getAvailableProperties = async (req, res) => {
  try {
    const result = await Property.findAvailable(); // limit 100, offset 0
    const properties = result.data;

    // Map projects relationship for frontend compat
    const mappedProperties = properties.map(p => ({
      ...p,
      project: p.projects
    }));

    return res.status(200).json({
      count: mappedProperties.length,
      properties: mappedProperties,
    });
  } catch (error) {
    console.error("Tenant View Properties Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};