const Application = require("../models/Application");

const Company = require("../models/Company");

const checkEligibility = require("../utils/checkEligibility");

const ExcelJS = require("exceljs");

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
      const fieldLabels = {
        resumeDriveLink: "Resume",
        github: "GitHub",
        linkedin: "LinkedIn",
        skills: "Skills",
        cgpa: "CGPA",
        class10Percentage: "Class 10 %",
        class12Percentage: "Class 12 %",
      };

      const readableFields = missingFields.map(
        (field) => fieldLabels[field] || field,
      );

      return res.status(400).json({
        success: false,
        message: `Complete profile before applying.\nMissing: ${readableFields.join(
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

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { status, remarks } = req.body;

    const validStatuses = [
      "applied",
      "oa",
      "interview",
      "selected",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("student")
      .populate("company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    if (remarks !== undefined) {
      application.remarks = remarks;
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportApplicants = async (req, res) => {
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
    }).populate("student");

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Applicants");

    worksheet.columns = [
      {
        header: "Name",
        key: "name",
        width: 25,
      },
      {
        header: "Scholar ID",
        key: "scholarId",
        width: 20,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Branch",
        key: "branch",
        width: 15,
      },
      {
        header: "CGPA",
        key: "cgpa",
        width: 10,
      },
      {
        header: "Backlogs",
        key: "backlogs",
        width: 12,
      },
      {
        header: "Resume",
        key: "resumeDriveLink",
        width: 40,
      },
      {
        header: "Github",
        key: "github",
        width: 30,
      },
      {
        header: "LinkedIn",
        key: "linkedin",
        width: 30,
      },
    ];

    applications.forEach((application) => {
      const student = application.student;

      worksheet.addRow({
        name: student?.name,
        scholarId: student?.scholarId,
        email: student?.email,
        branch: student?.branch,
        cgpa: student?.cgpa,
        backlogs: student?.backlogs,
        resumeDriveLink: student?.resumeDriveLink,
        github: student?.github,
        linkedin: student?.linkedin,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${company.companyName}_Applicants.xlsx`,
    );

    await workbook.xlsx.write(res);

    res.end();
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
  exportApplicants,
  updateApplicationStatus,
};
