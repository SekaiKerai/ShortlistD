import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/application/my`,
          {
            withCredentials: true,
          },
        );

        setApplications(res.data.applications);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "interview":
        return "bg-blue-100 text-blue-700";

      case "oa":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredApplications = applications.filter((application) => {
    const company = application.company;

    const term = search.toLowerCase();

    return (
      company?.companyName?.toLowerCase().includes(term) ||
      company?.role?.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: applications.length,

    inProcess: applications.filter(
      (app) => !["selected", "rejected"].includes(app.status),
    ).length,

    selected: applications.filter((app) => app.status === "selected").length,

    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>

          <p className="text-slate-500 mt-1">Track your placement journey</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-3xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total</p>

            <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
          </div>

          <div className="bg-white border rounded-3xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm">In Process</p>

            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {stats.inProcess}
            </h2>
          </div>

          <div className="bg-white border rounded-3xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Selected</p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {stats.selected}
            </h2>
          </div>

          <div className="bg-white border rounded-3xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Rejected</p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {stats.rejected}
            </h2>
          </div>
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
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-3xl border p-10 text-center text-slate-500">
            No applications found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredApplications.map((application) => {
              const company = application.company;

              return (
                <div
                  key={application._id}
                  className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">
                        {company?.companyName}
                      </h2>

                      <p className="text-slate-500 mt-1">{company?.role}</p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <p>
                      <strong>Package:</strong> {company?.package} LPA
                    </p>

                    <p>
                      <strong>Offer:</strong> {company?.offerType}
                    </p>

                    <p>
                      <strong>Applied On:</strong>{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Timeline feel */}
                  <div className="mt-5 border-t pt-4">
                    <p className="text-sm text-slate-500">Current Stage</p>

                    <h3 className="text-lg font-semibold mt-1">
                      {application.status === "oa"
                        ? "Online Assessment"
                        : application.status === "interview"
                          ? "Interview Round"
                          : application.status === "selected"
                            ? "Selected 🎉"
                            : application.status === "rejected"
                              ? "Rejected"
                              : "Application Submitted"}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
