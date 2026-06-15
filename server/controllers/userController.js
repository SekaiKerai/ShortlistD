const User = require("../models/User");

const completeProfile = async (req, res) => {
  try {
    const { scholarId, cgpa, backlogs } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.scholarId = scholarId;

    user.cgpa = cgpa;

    user.backlogs = backlogs;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin → Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin → Update student
const updateStudentByAdmin = async (req, res) => {
  try {
    const { studentId } = req.params;

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  completeProfile,
  getAllStudents,
  updateStudentByAdmin,
};
