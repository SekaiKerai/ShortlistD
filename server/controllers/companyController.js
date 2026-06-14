const Company = require("../models/Company");
const checkEligibility = require("../utils/checkEligibility");

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

module.exports = {
  createCompany,
  getCompanies,
};
