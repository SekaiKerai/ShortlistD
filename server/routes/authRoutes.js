const express = require("express");

const {
  googleLogin,
  getCurrentUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/google", googleLogin);

router.get("/me", protect, getCurrentUser);

module.exports = router;
