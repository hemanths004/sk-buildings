const Tenant = require("../models/TenantSupabase");
const Booking = require("../models/BookingSupabase");
const Project = require("../models/ProjectSupabase");
const Property = require("../models/PropertySupabase");
const supabase = require("../config/supabaseClient");

/* ===============================
   GET ALL TENANTS
=============================== */
exports.getAllTenants = async (req, res) => {
  try {
    // We need tenants and their owned properties. 
    // Since Supabase wrapper doesn't do deep joins by default in findAll, we'll use a custom query.
    const { data: tenants, error } = await supabase
      .from("tenants")
      .select("*, tenant_properties(properties(*))");

    if (error) throw error;

    // Map tenant_properties to ownedProperties for frontend compatibility
    const mappedTenants = tenants.map(t => ({
      ...t,
      ownedProperties: t.tenant_properties.map(tp => tp.properties)
    }));

    return res.status(200).json({
      count: mappedTenants.length,
      tenants: mappedTenants,
    });
  } catch (error) {
    console.error("Get All Tenants Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL BOOKINGS
=============================== */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    
    // The findAll in BookingSupabase.js already selects "*, properties(*), tenants(*)"
    // The frontend expects property.project to be populated, so let's adjust it
    const { data: allProperties } = await supabase.from("properties").select("*, projects(*)");
    const propMap = {};
    if (allProperties) {
      allProperties.forEach(p => {
        propMap[p.id] = p;
      });
    }

    const mappedBookings = bookings.map(b => {
      let propertyData = b.properties;
      if (propertyData && propMap[propertyData.id]) {
        propertyData.project = propMap[propertyData.id].projects;
      }
      return {
        ...b,
        tenant: b.tenants,
        property: propertyData
      };
    });

    return res.status(200).json({
      count: mappedBookings.length,
      bookings: mappedBookings,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   CREATE PROJECT (ADMIN)
=============================== */
// NOTE: Also exists in projectController.js, keeping it here if routes point here
exports.createProject = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Project name and location are required",
      });
    }

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
      description,
      created_by: adminId
    });

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
   ADMIN DASHBOARD (PROJECT-WISE INCOME)
=============================== */
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get counts
    const getCount = async (table, filter = null) => {
      let query = supabase.from(table).select("*", { count: "exact", head: true });
      if (filter) query = query.match(filter);
      const { count } = await query;
      return count || 0;
    };

    const [
      totalProjects,
      totalProperties,
      availableProperties,
      bookedProperties,
      totalTenants,
      totalBookings,
    ] = await Promise.all([
      getCount("projects"),
      getCount("properties"),
      getCount("properties", { status: "available" }),
      getCount("properties", { status: "booked" }),
      getCount("tenants"),
      getCount("bookings"),
    ]);

    // 🔥 PROJECT-WISE INCOME (Only Rented Properties)
    const { data: allProperties } = await supabase
      .from("properties")
      .select("price, project_id, status, projects(id, name)");
      
    const projectIncomeMap = {};

    if (allProperties) {
      allProperties.forEach((p) => {
        const project = p.projects;
        if (project) {
          if (!projectIncomeMap[project.id]) {
            projectIncomeMap[project.id] = {
              _id: project.id,
              id: project.id,
              projectName: project.name,
              totalIncome: 0,
              totalProperties: 0,
            };
          }
          // Only add to totalIncome if the property is rented
          if (p.status === 'rented') {
            projectIncomeMap[project.id].totalIncome += Number(p.price || 0);
          }
          projectIncomeMap[project.id].totalProperties += 1;
        }
      });
    }

    const projectIncome = Object.values(projectIncomeMap).sort((a, b) => b.totalIncome - a.totalIncome);
    const totalRevenue = projectIncome.reduce((acc, curr) => acc + curr.totalIncome, 0);

    // Chart 1: Monthly Bookings
    const { data: allBookings } = await supabase.from("bookings").select("booking_date, created_at");
    
    const monthlyBookingsMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (allBookings) {
      allBookings.forEach(b => {
        // Fallback to current date if booking_date is missing
        const date = new Date(b.booking_date || b.created_at || new Date());
        const monthName = months[date.getMonth()];
        monthlyBookingsMap[monthName] = (monthlyBookingsMap[monthName] || 0) + 1;
      });
    }
    const monthlyBookings = months.map(m => ({ name: m, bookings: monthlyBookingsMap[m] || 0 }));

    // Chart 2: Occupancy Rate
    const occupancyRate = [
      { name: 'Available', value: availableProperties },
      { name: 'Occupied/Booked', value: bookedProperties } // We can add rented/sold later if needed
    ];

    // Chart 3: Revenue Per Project (Re-using projectIncome)
    const revenuePerProject = projectIncome.map(p => ({
      name: p.projectName,
      revenue: p.totalIncome
    }));

    const { data: availablePropsData } = await supabase
      .from("properties")
      .select("id, title, type, status, projects(name)")
      .in("status", ["available", "booked"]);

    const availablePropertiesList = (availablePropsData || []).map(p => ({
      id: p.id,
      title: p.title,
      type: p.type,
      status: p.status,
      projectName: p.projects ? p.projects.name : "Unknown"
    }));

    return res.status(200).json({
      message: "Admin dashboard data",
      totals: {
        totalProjects,
        totalProperties,
        availableProperties,
        bookedProperties,
        totalTenants,
        totalBookings,
        totalRevenue
      },
      projectIncome,
      availablePropertiesList,
      charts: {
        monthlyBookings,
        occupancyRate,
        revenuePerProject
      }
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE TENANT DETAILS
 * PUT /admin/data/tenants/:id
 * =====================================
 */
exports.updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, rentAmount, rentDueDay } = req.body;

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (email !== undefined) updateFields.email = email; // assuming email added to tenant table schema
    if (rentAmount !== undefined) updateFields.rent_amount = Number(rentAmount);
    if (rentDueDay !== undefined) {
      // tenant schema has rent_due_date. To store day we might need a custom column or just calculate next date
      const today = new Date();
      let nextDue = new Date(today.getFullYear(), today.getMonth(), Number(rentDueDay));
      if (nextDue < today) {
        nextDue.setMonth(nextDue.getMonth() + 1);
      }
      updateFields.rent_due_date = nextDue.toISOString().split('T')[0];
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(id, updateFields);

    return res.status(200).json({
      message: "Tenant details updated successfully",
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Update Tenant Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};