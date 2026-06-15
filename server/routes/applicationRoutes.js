const express = require("express");

const router = express.Router();

const {
  applyToCompany,
  getMyApplications,
  getCompanyApplicants,
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

module.exports = router;
