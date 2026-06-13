const mongoose = require("mongoose");

const branchCodeMap = {
  1: "CE",
  2: "CSE",
  3: "ECE",
  4: "EE",
  5: "EIE",
  6: "ME",
};

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      default: null,
    },

    scholarId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (value) {
          if (this.role === "admin" && !value) {
            return true;
          }

          if (this.role === "student" && !value) {
            return false;
          }

          const scholarRegex = /^\d{7}$/;

          if (!scholarRegex.test(value)) {
            return false;
          }

          const degreeCode = Number(value[2]);
          const branchCode = Number(value[3]);

          if (degreeCode !== 1) {
            return false;
          }

          return !!branchCodeMap[branchCode];
        },
        message: "Invalid scholar ID format",
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    branch: {
      type: String,
      enum: ["CE", "CSE", "ECE", "EE", "EIE", "ME"],
      default: null,
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPlaced: {
      type: Boolean,
      default: false,
    },

    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
