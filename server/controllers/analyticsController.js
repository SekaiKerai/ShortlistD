const User = require("../models/User");

const getAnalytics = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    });

    const totalStudents = students.length;

    const placedStudents = students.filter((student) => student.isPlaced);

    const placedCount = placedStudents.length;

    const placementPercentage =
      totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : 0;

    const ctcs = placedStudents
      .map((student) => student.placedCTC)
      .filter(Boolean);

    const averageCTC =
      ctcs.length > 0
        ? (ctcs.reduce((sum, val) => sum + val, 0) / ctcs.length).toFixed(2)
        : 0;

    const sortedCTCs = [...ctcs].sort((a, b) => a - b);

    const medianCTC =
      sortedCTCs.length > 0 ? sortedCTCs[Math.floor(sortedCTCs.length / 2)] : 0;

    const highestCTC = ctcs.length > 0 ? Math.max(...ctcs) : 0;

    const branchStats = {};

    students.forEach((student) => {
      const branch = student.branch || "Unknown";

      if (!branchStats[branch]) {
        branchStats[branch] = {
          total: 0,
          placed: 0,
        };
      }

      branchStats[branch].total += 1;

      if (student.isPlaced) {
        branchStats[branch].placed += 1;
      }
    });

    return res.status(200).json({
      success: true,

      analytics: {
        totalStudents,
        placedCount,
        placementPercentage,
        averageCTC,
        medianCTC,
        highestCTC,
        branchStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};
