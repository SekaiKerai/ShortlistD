const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const testLogin = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: "Test User",
        email,
        role: role || "student",
        scholarId: role === "student" ? "2312176" : undefined,
      });
    }

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  testLogin,
};
