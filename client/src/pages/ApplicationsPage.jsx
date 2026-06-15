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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>

          <p className="text-slate-500 mt-1">Companies you have applied to</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading...
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
                  <h2 className="text-xl font-bold">{company?.companyName}</h2>

                  <p className="text-slate-500 mt-1">{company?.role}</p>

                  <div className="mt-4 space-y-2 text-sm">
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

                  <div className="mt-5">
                    <span className="bg-slate-100 px-4 py-2 rounded-full text-sm">
                      {application.status}
                    </span>
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
