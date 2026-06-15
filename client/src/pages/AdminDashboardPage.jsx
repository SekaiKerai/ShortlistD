import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedCount: 0,
    placementPercentage: 0,
  });

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, companyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/analytics`, {
            withCredentials: true,
          }),

          axios.get(`${import.meta.env.VITE_API_BASE_URL}/company`, {
            withCredentials: true,
          }),
        ]);

        setStats(analyticsRes.data.analytics);

        const openCompanies = companyRes.data.companies.filter(
          (company) => company.status === "open",
        );

        setCompanies(openCompanies.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Students",
      value: stats.totalStudents,
    },
    {
      title: "Placed",
      value: stats.placedCount,
    },
    {
      title: "Placement %",
      value: `${stats.placementPercentage}%`,
    },
    {
      title: "Open Drives",
      value: companies.length,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <p className="text-slate-300 mt-3 text-lg">
            Manage placements, companies and student records.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white border rounded-3xl p-6 shadow-sm"
            >
              <p className="text-slate-500 text-sm">{stat.title}</p>

              <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Open Drives */}
        <div className="bg-white border rounded-3xl p-7 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Open Drives</h2>

            <span className="text-sm text-slate-500">
              Recent active companies
            </span>
          </div>

          {companies.length === 0 ? (
            <p className="text-slate-500">No open drives</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {companies.map((company) => (
                <div
                  key={company._id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <h3 className="font-semibold">{company.companyName}</h3>

                    <p className="text-sm text-slate-500">{company.role}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{company.package} LPA</p>

                    <p className="text-sm text-slate-500">
                      {new Date(
                        company.applicationDeadline,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
