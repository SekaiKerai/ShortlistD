const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  },
);

// prevent duplicate apply
applicationSchema.index(
  {
    student: 1,
    company: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
