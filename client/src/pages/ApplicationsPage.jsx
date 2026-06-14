import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

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

      case "shortlisted":
        return "bg-blue-100 text-blue-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>

          <p className="text-slate-500 mt-1">Track your applied companies</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl border p-10 text-center text-slate-500">
            No applications yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {applications.map((application) => {
              const company = application.company;

              return (
                <div
                  key={application._id}
                  className="bg-white border rounded-3xl p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">
                        {company?.companyName}
                      </h2>

                      <p className="text-slate-500 mt-1">{company?.role}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm">
                    <p>
                      <strong>Package:</strong> {company?.package} LPA
                    </p>

                    <p>
                      <strong>Offer:</strong> {company?.offerType}
                    </p>

                    <p>
                      <strong>Applied:</strong>{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
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
