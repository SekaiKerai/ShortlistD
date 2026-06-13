const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: Number,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["internship", "fte", "intern+fte"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    minimumCGPA: {
      type: Number,
      required: true,
    },

    allowedBacklogs: {
      type: Number,
      default: 0,
    },

    eligibleBranches: [
      {
        type: String,
        enum: ["CE", "CSE", "ECE", "EE", "EIE", "ME"],
      },
    ],

    applicationDeadline: {
      type: Date,
      required: true,
    },

    whatsappGroupLink: {
      type: String,
      default: "",
    },

    jobDescriptionLink: {
      type: String,
      default: "",
    },

    drivePhase: {
      type: String,
      enum: ["APPLICATIONS_OPEN", "OA", "TECHNICAL", "HR", "RESULTS_DECLARED"],
      default: "APPLICATIONS_OPEN",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Company", companySchema);
