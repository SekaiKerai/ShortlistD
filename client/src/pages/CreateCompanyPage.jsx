import axios from "axios";
import { useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const branches = ["CE", "CSE", "ECE", "EE", "EIE", "ME"];

const graduationYears = [2027, 2028, 2029];

const profileFields = [
  "name",
  "email",
  "scholarId",
  "branch",
  "graduationYear",
  "cgpa",
  "backlogs",
  "class10Percentage",
  "class12Percentage",
  "resumeDriveLink",
  "github",
  "linkedin",
  "skills",
];

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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold mb-8">Create Company</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              className="border rounded-xl p-3"
              required
            />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className="border rounded-xl p-3"
              required
            />

            <input
              type="number"
              name="package"
              placeholder="Package (LPA)"
              value={formData.package}
              onChange={handleChange}
              className="border rounded-xl p-3"
              required
            />

            <select
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
              className="border rounded-xl p-3"
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
              className="border rounded-xl p-3"
              required
            />

            <input
              type="number"
              name="minimumCGPA"
              placeholder="Minimum CGPA"
              value={formData.minimumCGPA}
              onChange={handleChange}
              className="border rounded-xl p-3"
              min="0"
              max="10"
              step="0.1"
              required
            />

            <input
              type="number"
              name="allowedBacklogs"
              placeholder="Allowed Backlogs"
              value={formData.allowedBacklogs}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            <input
              type="datetime-local"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="border rounded-xl p-3"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full h-28"
            required
          />

          <div>
            <h2 className="font-semibold mb-3">Eligible Branches</h2>

            <div className="flex flex-wrap gap-3">
              {branches.map((branch) => (
                <label key={branch} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibleBranches.includes(branch)}
                    onChange={() => toggleBranch(branch)}
                  />

                  {branch}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Eligible Graduation Years</h2>

            <div className="flex gap-4 flex-wrap">
              {graduationYears.map((year) => (
                <label key={year} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibleGraduationYears.includes(year)}
                    onChange={() => toggleYear(year)}
                  />

                  {year}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Required Profile Fields</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profileFields.map((field) => (
                <label key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiredProfileFields.includes(field)}
                    onChange={() => toggleProfileField(field)}
                  />

                  {field}
                </label>
              ))}
            </div>
          </div>

          <input
            type="url"
            name="whatsappGroupLink"
            placeholder="WhatsApp Group Link"
            value={formData.whatsappGroupLink}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

          <input
            type="url"
            name="jobDescriptionLink"
            placeholder="Job Description Link"
            value={formData.jobDescriptionLink}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCompanyPage;
