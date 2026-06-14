const CompanyCard = ({ company }) => {
  const deadline = new Date(company.applicationDeadline);

  const now = new Date();

  const timeLeft = deadline - now;

  const daysLeft = Math.max(Math.ceil(timeLeft / (1000 * 60 * 60 * 24)), 0);

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{company.companyName}</h2>

          <p className="text-slate-500 mt-1">{company.role}</p>
        </div>

        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
          {company.offerType}
        </span>
      </div>

      {/* Package */}
      <div className="mt-5">
        <p className="text-2xl font-bold">{company.package} LPA</p>

        <p className="text-slate-500 text-sm">Package</p>
      </div>

      {/* Details */}
      <div className="mt-5 space-y-2 text-sm">
        <p>
          <strong>Location:</strong> {company.location}
        </p>

        <p>
          <strong>Min CGPA:</strong> {company.minimumCGPA}
        </p>

        <p>
          <strong>Deadline:</strong> {daysLeft} day
          {daysLeft !== 1 && "s"} left
        </p>
      </div>

      {/* Eligibility */}
      <div className="mt-5">
        {company.isEligible ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3">
            ✅ Eligible
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3">
            ❌ {company.eligibilityReason}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        disabled={!company.isEligible}
        className={`w-full mt-5 py-3 rounded-2xl font-medium transition-all ${
          company.isEligible
            ? "bg-slate-900 text-white hover:opacity-90"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        {company.isEligible ? "Apply" : "Cannot Apply"}
      </button>
    </div>
  );
};

export default CompanyCard;
