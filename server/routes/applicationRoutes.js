const express = require("express");

const router = express.Router();

const {
  applyToCompany,
  getMyApplications,
  getCompanyApplicants,
  removeApplication,
  exportApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/apply/:companyId", protect, applyToCompany);

router.get("/my", protect, getMyApplications);

router.get(
  "/company/:companyId",
  protect,
  authorizeRoles("admin"),
  getCompanyApplicants,
);

router.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("admin"),
  updateApplicationStatus,
);

router.delete(
  "/:applicationId",
  protect,
  authorizeRoles("admin"),
  removeApplication,
);

router.get(
  "/company/:companyId/export",
  protect,
  authorizeRoles("admin"),
  exportApplicants,
);

module.exports = router;
