const express = require("express");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test route working",
  });
});

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin route accessed",
  });
});

module.exports = router;
