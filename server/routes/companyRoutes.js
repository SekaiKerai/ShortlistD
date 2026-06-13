const express = require("express");

const {
  createCompany,
  getAllCompanies,
} = require("../controllers/companyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createCompany);
router.get("/", protect, getAllCompanies);
module.exports = router;
