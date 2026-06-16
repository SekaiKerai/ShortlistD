import axios from "axios";
import { useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const branches = ["CE", "CSE", "ECE", "EE", "EIE", "ME"];

const graduationYears = [2027, 2028, 2029];

const profileFieldOptions = [
  {
    label: "Resume",
    value: "resumeDriveLink",
  },
  {
    label: "GitHub",
    value: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin",
  },
  {
    label: "Skills",
    value: "skills",
  },
  {
    label: "CGPA",
    value: "cgpa",
  },
  {
    label: "Class 10 %",
    value: "class10Percentage",
  },
  {
    label: "Class 12 %",
    value: "class12Percentage",
  },
];

const inputStyle =
  "w-full rounded-[1.35rem] border border-[#DDD1C3] bg-[#F8F3EC] px-5 py-4 outline-none focus:border-[#C9A784] transition-all";

const CreateCompanyPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    offerType: "fte",
    location: "",
    description: "",
    minimumCGPA: "",
    allowedBacklogs: 0,
    eligibleBranches: [],
    eligibleGraduationYears: [],
    requiredProfileFields: [],
    applicationDeadline: "",
    whatsappGroupLink: "",
    jobDescriptionLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleBranch = (branch) => {
    setFormData({
      ...formData,
      eligibleBranches: formData.eligibleBranches.includes(branch)
        ? formData.eligibleBranches.filter((b) => b !== branch)
        : [...formData.eligibleBranches, branch],
    });
  };

  const toggleYear = (year) => {
    setFormData({
      ...formData,
      eligibleGraduationYears: formData.eligibleGraduationYears.includes(year)
        ? formData.eligibleGraduationYears.filter((y) => y !== year)
        : [...formData.eligibleGraduationYears, year],
    });
  };

  const toggleProfileField = (field) => {
    setFormData({
      ...formData,
      requiredProfileFields: formData.requiredProfileFields.includes(field)
        ? formData.requiredProfileFields.filter((f) => f !== field)
        : [...formData.requiredProfileFields, field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/company`,
        formData,
        {
          withCredentials: true,
        },
      );

      alert("Company created successfully");

      setFormData({
        companyName: "",
        role: "",
        package: "",
        offerType: "fte",
        location: "",
        description: "",
        minimumCGPA: "",
        allowedBacklogs: 0,
        eligibleBranches: [],
        eligibleGraduationYears: [],
        requiredProfileFields: [],
        applicationDeadline: "",
        whatsappGroupLink: "",
        jobDescriptionLink: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <div
          className="
          rounded-[2.5rem]
          border
          border-[#DCCFBE]
          bg-[#FBF7F1]
          p-8
        "
        >
          <p
            className="
            uppercase
            tracking-[0.18em]
            text-sm
            text-[#9A876F]
            font-semibold
          "
          >
            Placement Drive
          </p>

          <h1
            className="
            text-[3rem]
            font-black
            text-[#231F1B]
            mt-3
            leading-none
          "
          >
            Create Company
          </h1>

          <p className="text-[#746B60] mt-4 text-lg max-w-2xl">
            Add company details, eligibility and application information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[2.5rem]
          p-8
          space-y-10
        "
        >
          {/* Basic Info */}
          <section>
            <h2 className="text-2xl font-black text-[#231F1B] mb-6">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className={inputStyle}
                required
              />

              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                className={inputStyle}
                required
              />

              <input
                type="number"
                name="package"
                placeholder="Package (LPA)"
                value={formData.package}
                onChange={handleChange}
                className={inputStyle}
                required
              />

              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="fte">FTE</option>

                <option value="6m+fte">6M + FTE</option>

                <option value="6m+ppo">6M + PPO</option>
              </select>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className={inputStyle}
              />

              {/* Better Deadline */}
              <div
                className="
                rounded-[1.35rem]
                border
                border-[#DDD1C3]
                bg-[#F8F3EC]
                px-5
                py-4
              "
              >
                <label className="text-sm text-[#7A7166] font-medium block mb-2">
                  Application Deadline
                </label>

                <input
                  type="datetime-local"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="
                  bg-transparent
                  w-full
                  outline-none
                  text-[#231F1B]
                "
                  required
                />
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-black text-[#231F1B] mb-6">
              Eligibility
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <input
                type="number"
                name="minimumCGPA"
                placeholder="Minimum CGPA"
                value={formData.minimumCGPA}
                onChange={handleChange}
                className={inputStyle}
              />

              <input
                type="number"
                name="allowedBacklogs"
                placeholder="Allowed Backlogs"
                value={formData.allowedBacklogs}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            {/* Branches */}
            <div className="mb-8">
              <p className="font-semibold text-[#231F1B] mb-4 text-lg">
                Eligible Branches
              </p>

              {/* Selected */}
              {formData.eligibleBranches.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-5">
                  {formData.eligibleBranches.map((branch) => (
                    <div
                      key={branch}
                      className="
          flex
          items-center
          gap-3
          bg-[#231F1B]
          text-white
          px-5
          py-3
          rounded-full
          shadow-sm
        "
                    >
                      <span className="font-medium">{branch}</span>

                      <button
                        type="button"
                        onClick={() => toggleBranch(branch)}
                        className="
            flex
            items-center
            justify-center
            w-7
            h-7
            rounded-full
            bg-white/20
            hover:bg-white/30
            transition-all
            text-[1.15rem]
            font-bold
            leading-none
          "
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available */}
              <div className="flex flex-wrap gap-3">
                {branches
                  .filter(
                    (branch) => !formData.eligibleBranches.includes(branch),
                  )
                  .map((branch) => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className="
          px-5
          py-3
          rounded-full
          border
          border-[#DDD1C3]
          bg-[#F4ECE2]
          hover:bg-[#ECE1D3]
          transition-all
        "
                    >
                      + {branch}
                    </button>
                  ))}
              </div>
            </div>

            {/* Years */}
            <div>
              <p className="font-semibold text-[#231F1B] mb-4 text-lg">
                Eligible Batches
              </p>

              {/* Selected */}
              {formData.eligibleGraduationYears.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-5">
                  {formData.eligibleGraduationYears.map((year) => (
                    <div
                      key={year}
                      className="
            flex
            items-center
            gap-3
            bg-[#231F1B]
            text-white
            px-5
            py-3
            rounded-full
            shadow-sm
          "
                    >
                      <span className="font-medium">{year}</span>

                      <button
                        type="button"
                        onClick={() => toggleYear(year)}
                        className="
              flex
              items-center
              justify-center
              w-7
              h-7
              rounded-full
              bg-white/20
              hover:bg-white/30
              transition-all
              text-[1.15rem]
              font-bold
              leading-none
            "
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available */}
              <div className="flex flex-wrap gap-3">
                {graduationYears
                  .filter(
                    (year) => !formData.eligibleGraduationYears.includes(year),
                  )
                  .map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => toggleYear(year)}
                      className="
          px-5
          py-3
          rounded-full
          border
          border-[#DDD1C3]
          bg-[#F4ECE2]
          hover:bg-[#ECE1D3]
          transition-all
        "
                    >
                      + {year}
                    </button>
                  ))}
              </div>
            </div>
          </section>

          {/* Required Student Profile */}
          <section>
            <h2 className="text-2xl font-black text-[#231F1B] mb-5">
              Required Student Profile
            </h2>

            <p className="text-[#746B60] mb-5">
              Students must complete these details before applying.
            </p>

            {/* Selected */}
            {formData.requiredProfileFields.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-5">
                {formData.requiredProfileFields.map((field) => {
                  const option = profileFieldOptions.find(
                    (item) => item.value === field,
                  );

                  return (
                    <div
                      key={field}
                      className="
              flex
              items-center
              gap-3
              bg-[#231F1B]
              text-white
              px-5
              py-3
              rounded-full
            "
                    >
                      <span>{option?.label}</span>

                      <button
                        type="button"
                        onClick={() => toggleProfileField(field)}
                        className="
                w-7
                h-7
                rounded-full
                bg-white/20
              "
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Available */}
            <div className="flex flex-wrap gap-3">
              {profileFieldOptions
                .filter(
                  (item) =>
                    !formData.requiredProfileFields.includes(item.value),
                )
                .map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleProfileField(item.value)}
                    className="
            px-5
            py-3
            rounded-full
            border
            border-[#DDD1C3]
            bg-[#F4ECE2]
            hover:bg-[#ECE1D3]
            transition-all
          "
                  >
                    + {item.label}
                  </button>
                ))}
            </div>
          </section>

          
          {/* Description */}
          <section>
            <h2 className="text-2xl font-black text-[#231F1B] mb-5">
              Description
            </h2>

            <textarea
              name="description"
              placeholder="Role, process, eligibility and other details..."
              value={formData.description}
              onChange={handleChange}
              className={`${inputStyle} h-36 resize-none`}
            />
          </section>

          {/* Links */}
          <section className="grid md:grid-cols-2 gap-5">
            <input
              type="url"
              name="whatsappGroupLink"
              placeholder="WhatsApp Group Link"
              value={formData.whatsappGroupLink}
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              type="url"
              name="jobDescriptionLink"
              placeholder="Job Description Link"
              value={formData.jobDescriptionLink}
              onChange={handleChange}
              className={inputStyle}
            />
          </section>

          <button
            type="submit"
            disabled={loading}
            className="
            bg-[#231F1B]
            text-[#F7F2EA]
            px-8
            py-4
            rounded-[1.4rem]
            font-semibold
            hover:opacity-90
            transition-all
          "
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCompanyPage;
