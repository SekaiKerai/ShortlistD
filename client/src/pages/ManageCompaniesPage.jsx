import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/layout/DashboardLayout";

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

      // fetch eligibility stats
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
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/company/${companyId}`,
        editData,
        {
          withCredentials: true,
        },
      );

      alert("Company updated successfully");

      setEditingId(null);

      fetchCompanies();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update company");
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase()) ||
      company.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Companies</h1>

          <p className="text-slate-500 mt-1">Edit placement drives</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-2xl p-4"
        />

        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="bg-white border rounded-3xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">{company.companyName}</h2>

                <p className="text-slate-500 mt-1">{company.role}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <strong>Package:</strong> {company.package} LPA
                  </p>

                  <p>
                    <strong>Offer:</strong> {company.offerType}
                  </p>
                </div>

                {/* Eligibility Stats */}
                <div className="mt-5 bg-slate-50 rounded-2xl p-4 border text-sm space-y-2">
                  <p>
                    <strong>Eligible:</strong>{" "}
                    {eligibleStats[company._id]?.eligible ?? 0}
                  </p>

                  <p>
                    <strong>Applied:</strong>{" "}
                    {eligibleStats[company._id]?.applied ?? 0}
                  </p>

                  <p>
                    <strong>Not Applied:</strong>{" "}
                    {eligibleStats[company._id]?.notApplied ?? 0}
                  </p>
                </div>

                {editingId === company._id ? (
                  <div className="mt-5 space-y-3">
                    <input
                      type="number"
                      value={editData.minimumCGPA}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          minimumCGPA: e.target.value,
                        })
                      }
                      className="border rounded-xl p-3 w-full"
                      placeholder="Minimum CGPA"
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
                      className="border rounded-xl p-3 w-full"
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
                      className="border rounded-xl p-3 w-full"
                    />

                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                      className="border rounded-xl p-3 w-full"
                    >
                      <option value="open">Open</option>

                      <option value="closed">Closed</option>
                    </select>

                    <button
                      onClick={() => handleSave(company._id)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                      onClick={() => handleEdit(company)}
                      className="bg-slate-900 text-white py-3 rounded-xl"
                    >
                      Edit
                    </button>

                    <Link
                      to={`/admin/company/${company._id}/applicants`}
                      className="border border-slate-300 py-3 rounded-xl text-center"
                    >
                      Applicants
                    </Link>

                    <Link
                      to={`/admin/company/${company._id}/eligible`}
                      className="col-span-2 border border-slate-300 py-3 rounded-xl text-center"
                    >
                      View Eligible Students
                    </Link>
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
