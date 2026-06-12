const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");
const Project = require("./models/Project");
const Property = require("./models/Property");

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    // Clear existing data
    console.log("Clearing existing data...");
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Property.deleteMany({});

    // Create Admin
    console.log("Creating default admin...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    const admin = await Admin.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin created: username is 'admin', password is 'admin123'");

    // Create Projects
    console.log("Creating projects...");
    const project1 = await Project.create({
      name: "SK Heights",
      location: "Baner, Pune",
      description: "Premium residential apartments with world-class amenities",
    });

    const project2 = await Project.create({
      name: "SK Plaza",
      location: "Kothrud, Pune",
      description: "Modern commercial complex in a prime location",
    });
    console.log("Projects created.");

    // Create Properties
    console.log("Creating properties...");
    await Property.create({
      title: "Luxurious 2 BHK Flat (101)",
      type: "flat",
      project: project1._id,
      price: 5000000,
      floor: 1,
      sizeSqFt: 1200,
      description: "Spacious 2 BHK residential apartment with modern modular kitchen, balcony, and premium bathroom fittings. Located in the heart of Baner.",
      createdBy: admin._id,
    });

    await Property.create({
      title: "Premium 3 BHK Apartment (302)",
      type: "flat",
      project: project1._id,
      price: 7500000,
      floor: 3,
      sizeSqFt: 1600,
      description: "Stunning 3 BHK apartment offering a panoramic city view, extensive floor plan, 24/7 water backup, and dedicated parking spaces.",
      createdBy: admin._id,
    });

    await Property.create({
      title: "Ground Floor Retail Shop (G-1)",
      type: "shop",
      project: project2._id,
      price: 12000000,
      floor: 0,
      sizeSqFt: 800,
      description: "High-visibility retail space on the ground floor. Perfect for clothing boutique, supermarket, or upscale restaurant. Excellent footfall area.",
      createdBy: admin._id,
    });

    await Property.create({
      title: "First Floor Office / Clinic Space (102)",
      type: "shop",
      project: project2._id,
      price: 9000000,
      floor: 1,
      sizeSqFt: 600,
      description: "Professional commercial space on the first floor. Highly suitable for clinics, chartered accountant office, or IT consultancy.",
      createdBy: admin._id,
    });

    console.log("Properties created successfully.");
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
