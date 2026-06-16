const User = require("../models/User");

const completeProfile = async (req, res) => {
  try {
    const { scholarId, branch, graduationYear, cgpa, backlogs } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent overwriting once set
    if (user.scholarId) {
      return res.status(400).json({
        success: false,
        message: "Profile already completed",
      });
    }

    user.scholarId = scholarId;

    user.branch = branch;

    user.graduationYear = graduationYear;

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

const deleteIncompleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const incompleteProfile =
      !user.scholarId || !user.branch || !user.graduationYear;

    if (incompleteProfile) {
      await User.findByIdAndDelete(user._id);
    }

    return res.status(200).json({
      success: true,
      message: "Cleanup complete",
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
  deleteIncompleteProfile,
  getAllStudents,
  updateStudentByAdmin,
};
