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

module.exports = {
  completeProfile,
};
