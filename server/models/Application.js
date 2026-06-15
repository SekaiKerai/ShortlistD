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
      enum: ["applied", "oa", "interview", "selected", "rejected"],
      default: "applied",
    },

    remarks: {
      type: String,
      default: "",
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
