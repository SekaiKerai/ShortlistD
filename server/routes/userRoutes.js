const express = require("express");

const {
  completeProfile,
  getAllStudents,
  updateStudentByAdmin,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");
const router = express.Router();

// Student
router.put("/complete-profile", protect, completeProfile);

// Admin → Get all students
router.get("/students", protect, authorizeRoles("admin"), getAllStudents);

// Admin → Update student
router.put(
  "/students/:studentId",
  protect,
  authorizeRoles("admin"),
  updateStudentByAdmin,
);
    
// Admin → Get analytics
router.get("/analytics", protect, authorizeRoles("admin"), getAnalytics);

module.exports = router;
