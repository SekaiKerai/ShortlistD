const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    techStack: [
      {
        type: String,
      },
    ],

    githubLink: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
    },

    role: {
      type: String,
    },

    duration: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    scholarId: {
      type: String,
      unique: true,
      sparse: true,
    },

    branch: {
      type: String,
      enum: ["CE", "CSE", "ECE", "EE", "EIE", "ME"],
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    backlogs: {
      type: Number,
      default: 0,
    },

    graduationYear: {
      type: Number,
    },

    class10Percentage: {
      type: Number,
    },

    class12Percentage: {
      type: Number,
    },

    resumeDriveLink: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    projects: [projectSchema],

    experience: [experienceSchema],

    achievements: [achievementSchema],

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    leetcode: {
      type: String,
      default: "",
    },

    codeforces: {
      type: String,
      default: "",
    },

    isPlaced: {
      type: Boolean,
      default: false,
    },

    placedCompany: {
      type: String,
      default: "",
    },

    placedCTC: {
      type: Number,
      default: 0,
    },

    placedRole: {
      type: String,
      default: "",
    },

    placementType: {
      type: String,
      enum: ["6m+ppo", "6m+fte", "fte"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
