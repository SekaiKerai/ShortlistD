import axios from "axios";

import {
  MapPin,
  Clock3,
  IndianRupee,
  BadgeCheck,
  TriangleAlert,
} from "lucide-react";

const CompanyCard = ({ company }) => {
  const deadline = new Date(company.applicationDeadline);

  const now = new Date();

  const timeLeft = deadline - now;

  const daysLeft = Math.max(Math.ceil(timeLeft / (1000 * 60 * 60 * 24)), 0);

  const getDeadlineColor = () => {
    if (daysLeft <= 2) {
      return "text-red-600";
    }

    if (daysLeft <= 5) {
      return "text-[#B67542]";
    }

    return "text-[#6B645B]";
  };

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/application/apply/${company._id}`,
        {},
        {
          withCredentials: true,
        },
      );

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div
      className="
      bg-[#FBF7F1]
      border
      border-[#E0D5C7]
      rounded-[2rem]
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
      group
    "
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2
            className="
  text-[1.6rem]
  font-black
  text-[#231F1B]
  leading-tight
"
          >
            {company.companyName}
          </h2>

          <p
            className="
  text-[#6F655B]
  mt-2
  text-lg
  font-medium
"
          >
            {company.role}
          </p>
        </div>

        <span
          className="
          bg-[#EFE4D7]
          text-[#6B6157]
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          whitespace-nowrap
        "
        >
          {company.offerType}
        </span>
      </div>

      {/* Package */}
      <div className="mt-7">
        <div className="flex items-center gap-2">
          <IndianRupee size={20} className="text-[#C57B52]" />

          <h3 className="text-[2.2rem] font-black text-[#231F1B]">
            {company.package}
            <span className="text-xl font-bold ml-1">LPA</span>
          </h3>
        </div>

        <p className="text-[#7A7064] text-sm mt-1">Compensation package</p>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-[#5F574E]">
          <MapPin size={18} className="text-[#B67542]" />

          <span>{company.location || "Location not specified"}</span>
        </div>

        <div className="flex items-center gap-3 text-[#5F574E]">
          <BadgeCheck size={18} className="text-[#B67542]" />

          <span>
            Minimum CGPA:
            <strong className="ml-1">{company.minimumCGPA}</strong>
          </span>
        </div>

        <div
          className={`flex items-center gap-3 font-medium ${getDeadlineColor()}`}
        >
          <Clock3 size={18} />

          <span>
            {daysLeft > 0
              ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
              : "Deadline closed"}
          </span>
        </div>
      </div>

      {/* Eligibility */}
      <div className="mt-6">
        {company.isEligible ? (
          <div
            className="
            bg-[#E7F3EA]
            border
            border-[#C9DFC9]
            rounded-[1.5rem]
            px-5
            py-4
            flex
            items-center
            gap-3
            text-[#2E6A42]
            font-medium
          "
          >
            <BadgeCheck size={20} />
            Eligible to apply
          </div>
        ) : (
          <div
            className="
            bg-[#F9ECE8]
            border
            border-[#E7C9C1]
            rounded-[1.5rem]
            px-5
            py-4
            flex
            items-start
            gap-3
            text-[#B14D44]
          "
          >
            <TriangleAlert size={20} className="mt-0.5 shrink-0" />

            <span>{company.eligibilityReason}</span>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        disabled={!company.isEligible}
        onClick={handleApply}
        className={`
          w-full
          mt-6
          py-4
          rounded-[1.5rem]
          font-semibold
          transition-all
          duration-300
          ${
            company.isEligible
              ? `
              bg-[#231F1B]
              text-[#F7F2EA]
              hover:opacity-90
              hover:scale-[1.01]
            `
              : `
              bg-[#E7DDD0]
              text-[#9B8F81]
              cursor-not-allowed
            `
          }
        `}
      >
        {company.isEligible ? "Apply Now" : "Cannot Apply"}
      </button>
    </div>
  );
};

export default CompanyCard;
