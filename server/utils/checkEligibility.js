const checkEligibility = (user, company) => {
  // graduation year
  if (!company.eligibleGraduationYears.includes(user.graduationYear)) {
    return {
      isEligible: false,
      reason: "Batch not eligible",
    };
  }

  // branch
  if (!company.eligibleBranches.includes(user.branch)) {
    return {
      isEligible: false,
      reason: "Branch not eligible",
    };
  }

  // cgpa
  if (user.cgpa < company.minimumCGPA) {
    return {
      isEligible: false,
      reason: "CGPA requirement not met",
    };
  }

  // backlog
  if (user.backlogs > company.allowedBacklogs) {
    return {
      isEligible: false,
      reason: "Too many backlogs",
    };
  }

  // EOP logic
  if (user.isPlaced) {
    const studentCTC = user.placedCTC;

    const companyCTC = company.package;

    // FTE / 6m+FTE
    if (user.placementType === "fte" || user.placementType === "6m+fte") {
      if (studentCTC >= 10) {
        return {
          isEligible: false,
          reason: "EOP reached",
        };
      }

      if (company.offerType !== "fte") {
        return {
          isEligible: false,
          reason: "Can only apply to FTE",
        };
      }

      if (companyCTC < studentCTC * 1.8) {
        return {
          isEligible: false,
          reason: "1.8x CTC rule not met",
        };
      }
    }

    // 6m+ppo
    if (user.placementType === "6m+ppo") {
      if (company.offerType !== "fte") {
        return {
          isEligible: false,
          reason: "Only FTE allowed",
        };
      }

      if (companyCTC < studentCTC * 1.5) {
        return {
          isEligible: false,
          reason: "1.5x rule not met",
        };
      }
    }
  }

  return {
    isEligible: true,
    reason: "Eligible",
  };
};

module.exports = checkEligibility;
