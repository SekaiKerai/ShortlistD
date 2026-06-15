const Application = require("../models/Application");

const Company = require("../models/Company");

const checkEligibility = require("../utils/checkEligibility");

const applyToCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const user = req.user;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // deadline check
    if (new Date() > new Date(company.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // eligibility check
    const eligibility = checkEligibility(user, company);

    if (!eligibility.isEligible) {
      return res.status(403).json({
        success: false,
        message: eligibility.reason,
      });
    }

    // profile completeness check
    const missingFields = [];

    company.requiredProfileFields.forEach((field) => {
      const value = user[field];

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Complete required profile fields: ${missingFields.join(
          ", ",
        )}`,
      });
    }

    // duplicate apply check
    const existingApplication = await Application.findOne({
      student: user._id,
      company: companyId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    await Application.create({
      student: user._id,
      company: companyId,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("APPLY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    })
      .populate("company")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyApplicants = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const applications = await Application.find({
      company: companyId,
    })
      .populate("student")
      .populate("company")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      company,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json({
      success: true,
      message: "Application removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyToCompany,
  getMyApplications,
  getCompanyApplicants,
  removeApplication,
};
