const Booking = require("../models/BookingSupabase");
const Property = require("../models/PropertySupabase");
const Tenant = require("../models/TenantSupabase");
const supabase = require("../config/supabaseClient");

// Helper to map backend Supabase row to frontend format
const mapBooking = (booking) => {
  if (!booking) return null;
  
  // Construct documents array for frontend compat
  const documents = [];
  if (booking.tenants?.aadhaar_url) {
    documents.push({ type: 'aadhaar', url: booking.tenants.aadhaar_url, _id: 'aadhaar' });
  }
  if (booking.tenants?.agreement_url) {
    documents.push({ type: 'agreement', url: booking.tenants.agreement_url, _id: 'agreement' });
  }

  // Format property object if it exists
  let mappedProperty = booking.properties;
  if (mappedProperty && mappedProperty.projects) {
    mappedProperty.project = mappedProperty.projects; // map relation name
  }

  return {
    ...booking,
    _id: booking.id, // compat
    user: booking.tenants, // map tenant to user
    tenant: booking.tenants,
    property: mappedProperty,
    bookingDate: booking.booking_date || booking.created_at,
    documents,
  };
};

/**
 * =====================================
 * TENANT: BOOK A PROPERTY
 * POST /bookings
 * =====================================
 */
exports.createBooking = async (req, res) => {
  try {
    const tenantId = req.user.id || req.user._id;
    const { property, propertyId, moveInDate, paymentType, rentAmount, rentDueDate, numberOfPeople } = req.body;

    const actualPropertyId = property || propertyId;

    if (!actualPropertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const targetProperty = await Property.findById(actualPropertyId);
    if (!targetProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (targetProperty.status !== "available") {
      return res.status(400).json({ message: "Property is not available for booking" });
    }

    // Check if a booking already exists for this property
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("*")
      .eq("property_id", actualPropertyId)
      .neq("status", "cancelled")
      .maybeSingle();

    if (existingBooking) {
      return res.status(400).json({ message: "Property already has a pending or confirmed booking" });
    }

    // Create booking (status: pending)
    // Note: Supabase bookings schema now stores requested_rent and number_of_people
    const booking = await Booking.create({
      tenant_id: tenantId,
      property_id: actualPropertyId,
      status: "pending",
      number_of_people: numberOfPeople || null,
      requested_rent: rentAmount || null
    });

    // We fetch again to get related tenant and property
    const fullBooking = await Booking.findById(booking.id);

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      booking: mapBooking(fullBooking),
    });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * TENANT: GET MY BOOKINGS
 * GET /bookings/my-bookings
 * =====================================
 */
exports.getUserBookings = async (req, res) => {
  try {
    const tenantId = req.user.id || req.user._id;

    const bookings = await Booking.findByTenant(tenantId);
    const mapped = bookings.map(mapBooking);

    return res.status(200).json(mapped);
  } catch (error) {
    console.error("Get User Bookings Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * PUBLIC/TENANT: GET SINGLE BOOKING
 * GET /bookings/:id
 * =====================================
 */
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(mapBooking(booking));
  } catch (error) {
    console.error("Get Booking Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE BOOKING STATUS
 * PATCH /bookings/:id/status
 * =====================================
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    let booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking = await Booking.findByIdAndUpdate(id, { status });

    if (status === "confirmed") {
      // 1. Mark property as booked
      await Property.findByIdAndUpdate(booking.property_id, { status: "booked" });

      // 2. Link property to tenant
      await Tenant.addProperty(booking.tenant_id, booking.property_id);

      if (req.body.rentAmount || booking.requested_rent) {
        const moveIn = new Date(); // Or from req
        const dueDay = req.body.rentDueDate || 5;

        let dueDate = new Date(moveIn.getFullYear(), moveIn.getMonth(), dueDay);
        if (dueDate < moveIn) {
          dueDate.setMonth(dueDate.getMonth() + 1);
        }

        await Tenant.findByIdAndUpdate(booking.tenant_id, {
          rent_amount: Number(req.body.rentAmount || booking.requested_rent),
          rent_due_date: dueDate.toISOString().split('T')[0]
        });
      }
    } else if (status === "cancelled") {
      // 1. Free property
      await Property.findByIdAndUpdate(booking.property_id, { status: "available" });

      // 2. Unlink property from tenant
      await supabase
        .from("tenant_properties")
        .delete()
        .eq("tenant_id", booking.tenant_id)
        .eq("property_id", booking.property_id);
    }

    const updatedBooking = await Booking.findById(id);

    return res.status(200).json({
      message: `Booking status updated to ${status}`,
      booking: mapBooking(updatedBooking),
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * TENANT/ADMIN: UPLOAD BOOKING DOCUMENT
 * POST /bookings/:id/documents
 * =====================================
 */
exports.uploadBookingDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'aadhaar' or 'agreement'

    if (!type || !["aadhaar", "agreement"].includes(type)) {
      return res.status(400).json({ message: "Valid document type (aadhaar/agreement) is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Relative web URL or path
    const fileUrl = `/uploads/${type === "aadhaar" ? "aadhaar" : "agreements"}/${req.file.filename}`;

    // Update global Tenant fields directly
    const updateData = {};
    if (type === "aadhaar") {
      updateData.aadhaar_url = fileUrl;
    } else {
      updateData.agreement_url = fileUrl;
    }
    await Tenant.findByIdAndUpdate(booking.tenant_id, updateData);

    const updatedBooking = await Booking.findById(id);

    return res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      booking: mapBooking(updatedBooking),
    });
  } catch (error) {
    console.error("Upload Document Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================
 * ADMIN: GET ALL BOOKINGS
 * GET /bookings
 * =====================================
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    
    // The findAll in BookingSupabase.js already selects "*, properties(*), tenants(*)"
    // Fetch projects to append them
    const { data: allProperties } = await supabase.from("properties").select("*, projects(*)");
    const propMap = {};
    if (allProperties) {
      allProperties.forEach(p => {
        propMap[p.id] = p;
      });
    }

    const mappedBookings = bookings.map(b => {
      if (b.properties && propMap[b.properties.id]) {
        b.properties.projects = propMap[b.properties.id].projects;
      }
      return mapBooking(b);
    });

    return res.status(200).json(mappedBookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};