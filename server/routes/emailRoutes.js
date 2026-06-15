const express = require("express");

const router = express.Router();

const { sendBulkEmail } = require("../controllers/emailController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/bulk", protect, authorizeRoles("admin"), sendBulkEmail);

module.exports = router;
