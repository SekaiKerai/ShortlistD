const Company = require("../models/Company");

const checkEligibility = require("../utils/checkEligibility");

const User = require("../models/User");

const Application = require("../models/Application");

const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    const companiesWithEligibility = companies.map((company) => {
      // admin
      if (req.user?.role === "admin") {
        return {
          ...company.toObject(),
          isEligible: true,
          eligibilityReason: "",
        };
      }

      const eligibility = checkEligibility(req.user, company);

      return {
        ...company.toObject(),
        isEligible: eligibility.isEligible,
        eligibilityReason: eligibility.reason,
      };
    });

    return res.status(200).json({
      success: true,
      companies: companiesWithEligibility,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEligibleStudents = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const students = await User.find({
      role: "student",
    });

    const eligibleStudents = students.filter((student) => {
      const branchEligible = company.eligibleBranches.includes(student.branch);

      const cgpaEligible = student.cgpa >= company.minimumCGPA;

      const backlogEligible = student.backlogs <= company.allowedBacklogs;

      const graduationEligible = company.eligibleGraduationYears.includes(
        student.graduationYear,
      );

      return (
        branchEligible && cgpaEligible && backlogEligible && graduationEligible
      );
    });

    const applications = await Application.find({
      company: companyId,
    });

    const appliedStudentIds = applications.map((app) => app.student.toString());

    const eligibleWithStatus = eligibleStudents.map((student) => ({
      ...student.toObject(),
      hasApplied: appliedStudentIds.includes(student._id.toString()),
    }));

    return res.status(200).json({
      success: true,

      totalEligible: eligibleStudents.length,

      totalApplied: applications.length,

      totalNotApplied: eligibleStudents.length - applications.length,

      students: eligibleWithStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  updateCompany,
  getEligibleStudents,
};
