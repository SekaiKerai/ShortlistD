import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/layout/DashboardLayout";

const inputStyle =
  "w-full rounded-[1.2rem] border border-[#DDD1C3] bg-[#F8F3EC] px-4 py-3 outline-none focus:border-[#C9A784] transition-all";

const ManageCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({});

  const [eligibleStats, setEligibleStats] = useState({});

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/company`,
        {
          withCredentials: true,
        },
      );

      setCompanies(res.data.companies);

      const stats = {};

      await Promise.all(
        res.data.companies.map(async (company) => {
          try {
            const statRes = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/company/${company._id}/eligible-students`,
              {
                withCredentials: true,
              },
            );

            stats[company._id] = {
              eligible: statRes.data.totalEligible,

              applied: statRes.data.totalApplied,

              notApplied: statRes.data.totalNotApplied,
            };
          } catch {
            stats[company._id] = {
              eligible: 0,
              applied: 0,
              notApplied: 0,
            };
          }
        }),
      );

      setEligibleStats(stats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company) => {
    setEditingId(company._id);

    setEditData({
      minimumCGPA: company.minimumCGPA,

      allowedBacklogs: company.allowedBacklogs,

      applicationDeadline: company.applicationDeadline?.slice(0, 16) || "",

      whatsappGroupLink: company.whatsappGroupLink || "",

      jobDescriptionLink: company.jobDescriptionLink || "",

      status: company.status,
    });
  };

  const handleSave = async (companyId) => {
    try {
      const normalizedEditData = {
        ...editData,
        minimumCGPA:
          editData.minimumCGPA === "" ? "" : Number(editData.minimumCGPA),
        allowedBacklogs:
          editData.allowedBacklogs === ""
            ? ""
            : Number(editData.allowedBacklogs),
        applicationDeadline: editData.applicationDeadline
          ? new Date(editData.applicationDeadline).toISOString()
          : "",
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/company/${companyId}`,
        normalizedEditData,
        {
          withCredentials: true,
        },
      );

      alert("Company updated successfully");

      setEditingId(null);

      fetchCompanies();
    } catch (error) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Failed to update company",
      );
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      company.role?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
            Placement Drives
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
            Manage Companies
          </h1>

          <p className="text-[#746B60] mt-4 text-lg">
            Monitor active drives, edit eligibility and export applicant
            records.
          </p>
        </div>

        {/* Search */}
        <div
          className="
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[2rem]
          p-5
        "
        >
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputStyle}
          />
        </div>

        {loading ? (
          <div
            className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-10
            text-center
          "
          >
            Loading...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div
            className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-10
            text-center
            text-[#746B60]
          "
          >
            No companies found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="
                  bg-[#FBF7F1]
                  border
                  border-[#DED3C6]
                  rounded-[2rem]
                  p-6
                  transition-all
                  hover:shadow-md
                "
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="
                        text-[1.7rem]
                        font-black
                        text-[#231F1B]
                        leading-tight
                      "
                    >
                      {company.companyName}
                    </h2>

                    <p className="text-[#746B60] mt-2 text-lg">
                      {company.role}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      company.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {company.status.toUpperCase()}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3 text-[0.95rem] text-[#5F574D]">
                  <p>
                    <strong>Package:</strong> {company.package} LPA
                  </p>

                  <p>
                    <strong>Offer:</strong> {company.offerType}
                  </p>

                  <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(company.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>

                {/* Stats */}
                <div
                  className="
                    mt-6
                    bg-[#F4ECE2]
                    border
                    border-[#E2D5C6]
                    rounded-[1.5rem]
                    p-4
                  "
                >
                  <p className="font-semibold text-[#231F1B] mb-3">
                    Drive Analytics
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <h3 className="font-black text-xl">
                        {eligibleStats[company._id]?.eligible ?? 0}
                      </h3>

                      <p className="text-xs text-[#746B60]">Eligible</p>
                    </div>

                    <div>
                      <h3 className="font-black text-xl">
                        {eligibleStats[company._id]?.applied ?? 0}
                      </h3>

                      <p className="text-xs text-[#746B60]">Applied</p>
                    </div>

                    <div>
                      <h3 className="font-black text-xl">
                        {eligibleStats[company._id]?.notApplied ?? 0}
                      </h3>

                      <p className="text-xs text-[#746B60]">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Edit */}
                {editingId === company._id ? (
                  <div className="mt-6 space-y-3">
                    <input
                      type="number"
                      value={editData.minimumCGPA}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          minimumCGPA: e.target.value,
                        })
                      }
                      placeholder="Minimum CGPA"
                      className={inputStyle}
                    />

                    <input
                      type="number"
                      value={editData.allowedBacklogs}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          allowedBacklogs: e.target.value,
                        })
                      }
                      placeholder="Allowed Backlogs"
                      className={inputStyle}
                    />

                    <input
                      type="datetime-local"
                      value={editData.applicationDeadline}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          applicationDeadline: e.target.value,
                        })
                      }
                      className={inputStyle}
                    />

                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                      className={inputStyle}
                    >
                      <option value="open">Open</option>

                      <option value="closed">Closed</option>
                    </select>

                    <button
                      onClick={() => handleSave(company._id)}
                      className="
                        w-full
                        bg-[#231F1B]
                        text-white
                        py-3
                        rounded-[1.2rem]
                      "
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => handleEdit(company)}
                      className="
                        bg-[#231F1B]
                        text-white
                        py-3
                        rounded-[1.2rem]
                      "
                    >
                      Edit
                    </button>

                    <Link
                      to={`/admin/company/${company._id}/applicants`}
                      className="
                        border
                        border-[#D5C7B7]
                        py-3
                        rounded-[1.2rem]
                        text-center
                      "
                    >
                      Applicants
                    </Link>

                    <Link
                      to={`/admin/company/${company._id}/eligible`}
                      className="
                        col-span-2
                        border
                        border-[#D5C7B7]
                        py-3
                        rounded-[1.2rem]
                        text-center
                      "
                    >
                      Eligible Students
                    </Link>

                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/company/${company._id}/export-eligible`}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        border
                        border-[#D5C7B7]
                        py-3
                        rounded-[1.2rem]
                        text-center
                      "
                    >
                      Export Eligible
                    </a>

                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/application/company/${company._id}/export`}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        border
                        border-[#D5C7B7]
                        py-3
                        rounded-[1.2rem]
                        text-center
                      "
                    >
                      Export Applicants
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageCompaniesPage;
