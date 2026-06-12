const Tenant = require("../models/TenantSupabase");
const Project = require("../models/ProjectSupabase");

/**
 * GET /tenant/my-properties
 * Returns properties owned/booked by logged-in tenant
 */
exports.getMyProperties = async (req, res) => {
  try {
    const tenantId = req.user.id || req.user._id;

    const propertiesData = await Tenant.getTenantProperties(tenantId);
    // propertiesData is [{ properties: { ... } }]
    const properties = propertiesData.map(p => p.properties);

    return res.status(200).json({
      message: "Your properties fetched successfully",
      count: properties.length,
      properties: properties,
    });
  } catch (error) {
    console.error("Get My Properties Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};