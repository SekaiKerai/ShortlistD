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

        setCompanies(openCompanies);
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
      sub: "Registered students",
    },
    {
      title: "Placed",
      value: stats.placedCount,
      sub: "Successful offers",
    },
    {
      title: "Placement %",
      value: `${stats.placementPercentage}%`,
      sub: "Current placement rate",
    },
    {
      title: "Open Drives",
      value: companies.length,
      sub: "Companies hiring",
    },
  ];

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
          p-9
          relative
          overflow-hidden
        "
        >
          <div className="relative z-10">
            <p
              className="
              uppercase
              tracking-[0.18em]
              text-sm
              text-[#9A876F]
              font-semibold
            "
            >
              Training & Placement Cell
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
              Admin Control Center
            </h1>

            <p className="text-[#746B60] mt-4 text-lg max-w-2xl">
              Manage placement drives, students, company records and recruitment
              activity from one place.
            </p>
          </div>

          <div
            className="
            absolute
            -right-20
            -top-20
            w-[280px]
            h-[280px]
            rounded-full
            bg-[#E9D7C6]
            blur-[70px]
            opacity-60
          "
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="
              bg-[#FBF7F1]
              border
              border-[#DED3C6]
              rounded-[2rem]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-md
            "
            >
              <p className="text-[#8B8072] text-sm">{stat.title}</p>

              <h2
                className="
                text-[2.5rem]
                font-black
                text-[#231F1B]
                mt-2
              "
              >
                {stat.value}
              </h2>

              <p className="text-sm text-[#746B60] mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Open Drives */}
        <div
          className="
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[2rem]
          p-7
          overflow-hidden
        "
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2
                className="
                text-2xl
                font-black
                text-[#231F1B]
              "
              >
                Open Drives
              </h2>

              <p className="text-[#746B60] mt-2">
                Active placement opportunities currently accepting applications.
              </p>
            </div>

            <span
              className="
              bg-[#EFE4D7]
              text-[#6A5F52]
              px-4
              py-2
              rounded-full
              text-sm
              font-medium
              shrink-0
            "
            >
              {companies.length} Active
            </span>
          </div>

          {/* Better spacing */}
          <div className="mt-8" />

          {companies.length === 0 ? (
            <div
              className="
              rounded-[1.8rem]
              bg-[#F4ECE2]
              border
              border-[#E5D8C9]
              p-8
              text-center
              text-[#746B60]
            "
            >
              No open drives
            </div>
          ) : (
            <div
              className="
              space-y-4
              max-h-[540px]
              overflow-y-auto
              pr-2
            "
            >
              {companies.map((company) => (
                <div
                  key={company._id}
                  className="
                  bg-[#F4ECE2]
                  border
                  border-[#E4D7C8]
                  rounded-[1.8rem]
                  p-5
                  flex
                  justify-between
                  items-center
                  hover:shadow-sm
                  transition-all
                "
                >
                  <div>
                    <h3
                      className="
                      text-[1.45rem]
                      font-black
                      text-[#231F1B]
                      leading-tight
                    "
                    >
                      {company.companyName}
                    </h3>

                    <p className="text-[#746B60] mt-2 text-[1rem]">
                      {company.role}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="
                      text-xl
                      font-bold
                      text-[#231F1B]
                    "
                    >
                      {company.package} LPA
                    </p>

                    <p className="text-sm text-[#7A7166] mt-2">
                      Deadline:{" "}
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
