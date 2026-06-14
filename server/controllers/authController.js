const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ADMIN_EMAILS = ["sekai.kerai@gmail.com"];

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    const normalizedEmail = email.toLowerCase();

    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    const isInstituteEmail = normalizedEmail.endsWith(".nits.ac.in");

    console.log("EMAIL:", normalizedEmail);

    console.log("IS ADMIN:", isAdmin);

    console.log("IS INSTITUTE:", isInstituteEmail);

    if (!isAdmin && !isInstituteEmail) {
      return res.status(403).json({
        success: false,
        message: "Only institute email accounts are allowed",
      });
    }

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // create user
    if (!user) {
      user = await User.create({
        googleId,
        name,
        email: normalizedEmail,
        profilePicture: picture,
        role: isAdmin ? "admin" : "student",
        scholarId: isAdmin ? undefined : null,
      });
    } else {
      // fix old users missing googleId
      if (!user.googleId) {
        user.googleId = googleId;
      }

      // update role if admin logs in
      if (isAdmin && user.role !== "admin") {
        user.role = "admin";
      }

      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("PROFILE UPDATE BODY:", req.body);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const blockedFields = [
      "role",
      "isPlaced",
      "placedCompany",
      "placedCTC",
      "placementType",
      "googleId",
      "email",
    ];

    // scholarId can only be set once
    if (user.scholarId) {
      blockedFields.push("scholarId");
    }

    // branch can only be set once
    if (user.branch) {
      blockedFields.push("branch");
    }

    blockedFields.forEach((field) => {
      delete req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  googleLogin,
  getCurrentUser,
  updateProfile,
  logoutUser,
};
