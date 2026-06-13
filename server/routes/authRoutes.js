const express = require("express");

const {
  googleLogin,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/google", googleLogin);

router.get("/me", protect, getCurrentUser);

router.post("/logout", protect, logoutUser);

module.exports = router;
