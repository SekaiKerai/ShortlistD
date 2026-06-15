const express = require("express");

const {
  createCompany,
  getCompanies,
  getEligibleStudents,
  exportEligibleStudents,
  updateCompany,
} = require("../controllers/companyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createCompany);

router.get("/", protect, getCompanies);

router.put("/:companyId", protect, authorizeRoles("admin"), updateCompany);

router.get(
  "/:companyId/eligible-students",
  protect,
  authorizeRoles("admin"),
  getEligibleStudents,
);

router.get(
  "/:companyId/export-eligible",
  protect,
  authorizeRoles("admin"),
  exportEligibleStudents,
);

module.exports = router;
