const express = require("express");

const { completeProfile } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/complete-profile", protect, completeProfile);

module.exports = router;