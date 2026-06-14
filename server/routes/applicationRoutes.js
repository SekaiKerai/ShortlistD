const express = require("express");

const router = express.Router();

const {
  applyToCompany,
  getMyApplications,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/apply/:companyId", protect, applyToCompany);
router.get("/my", protect, getMyApplications);
module.exports = router;
