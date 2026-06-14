const express = require("express");

const {
  googleLogin,
  getCurrentUser,
  logoutUser,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/google", googleLogin);

router.get("/me", protect, getCurrentUser);

router.post("/logout", logoutUser);

router.put("/profile", protect, updateProfile);

module.exports = router;
