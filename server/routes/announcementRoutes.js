const express = require("express");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
    deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createAnnouncement);

router.get("/", protect, getAnnouncements);

router.delete("/:id", protect, authorizeRoles("admin"), deleteAnnouncement);

module.exports = router;