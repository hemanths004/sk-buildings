const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectPropertyBreakdown,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { adminProtect } = require("../middleware/adminProtect");

/* ===============================
   PROJECT ROUTES
   Base URL: /admin/projects
=============================== */

// Create a new project (ADMIN)
router.post("/create", adminProtect, createProject);

// Update a project (ADMIN)
router.put("/update/:id", adminProtect, updateProject);

// Delete a project (ADMIN)
router.delete("/delete/:id", adminProtect, deleteProject);

// Get all projects (ADMIN / PUBLIC)
router.get("/all", getAllProjects);

// 🔥 Project → Property breakdown (ADMIN ONLY)
router.get("/breakdown", adminProtect, getProjectPropertyBreakdown);

module.exports = router;