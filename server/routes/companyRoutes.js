const express = require("express");

const {
  createCompany,
  getCompanies,
  updateCompany,
  getEligibleStudents,
} = require("../controllers/companyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Create company
router.post("/", protect, authorizeRoles("admin"), createCompany);

// Get companies
router.get("/", protect, getCompanies);

// Update company
router.put("/:companyId", protect, authorizeRoles("admin"), updateCompany);

// Get eligible students for a company
router.get("/:companyId/eligible-students", protect, getEligibleStudents);

module.exports = router;
