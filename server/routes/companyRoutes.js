const express = require("express");

const {
  createCompany,
  getCompanies,
} = require("../controllers/companyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createCompany);
router.get("/", protect, getCompanies);
module.exports = router;
