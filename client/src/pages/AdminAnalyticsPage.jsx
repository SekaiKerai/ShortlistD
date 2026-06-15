import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/analytics`,
          {
            withCredentials: true,
          },
        );

        setAnalytics(res.data.analytics);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
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
          Loading analytics...
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: analytics?.totalStudents || 0,
    },
    {
      title: "Placed Students",
      value: analytics?.placedCount || 0,
    },
    {
      title: "Placement %",
      value: `${analytics?.placementPercentage || 0}%`,
    },
    {
      title: "Average CTC",
      value: `${analytics?.averageCTC || 0} LPA`,
    },
    {
      title: "Median CTC",
      value: `${analytics?.medianCTC || 0} LPA`,
    },
    {
      title: "Highest Package",
      value: `${analytics?.highestCTC || 0} LPA`,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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
            Placement Insights
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
            Analytics
          </h1>

          <p className="text-[#746B60] mt-4 text-lg">
            Track placement performance, compensation and branch-wise hiring.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="
                  bg-[#FBF7F1]
                  border
                  border-[#DED3C6]
                  rounded-[2rem]
                  p-6
                "
            >
              <p className="text-[#7A7166] text-sm">{stat.title}</p>

              <h2
                className="
                    text-[2.3rem]
                    font-black
                    text-[#231F1B]
                    mt-2
                  "
              >
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Branch Stats */}
        <div
          className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-7
          "
        >
          <div className="mb-6">
            <h2
              className="
                text-2xl
                font-black
                text-[#231F1B]
              "
            >
              Branch-wise Placements
            </h2>

            <p className="text-[#746B60] mt-1">
              Placement performance by branch.
            </p>
          </div>

          <div className="space-y-4">
            {analytics?.branchStats &&
            Object.keys(analytics.branchStats).length > 0 ? (
              Object.entries(analytics.branchStats).map(([branch, data]) => {
                const percentage =
                  data.total > 0
                    ? Math.round((data.placed / data.total) * 100)
                    : 0;

                return (
                  <div
                    key={branch}
                    className="
                        bg-[#F4ECE2]
                        border
                        border-[#E2D5C6]
                        rounded-[1.5rem]
                        p-5
                      "
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3
                          className="
                              text-lg
                              font-bold
                              text-[#231F1B]
                            "
                        >
                          {branch}
                        </h3>

                        <p className="text-[#746B60] text-sm mt-1">
                          {data.placed}/{data.total} placed
                        </p>
                      </div>

                      <div className="text-right">
                        <h3
                          className="
                              text-2xl
                              font-black
                              text-[#231F1B]
                            "
                        >
                          {percentage}%
                        </h3>

                        <p className="text-sm text-[#746B60]">placed</p>
                      </div>
                    </div>

                    <div
                      className="
                          h-3
                          bg-[#E5D9CC]
                          rounded-full
                          overflow-hidden
                          mt-4
                        "
                    >
                      <div
                        className="
                            h-full
                            bg-[#231F1B]
                            rounded-full
                          "
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[#746B60]">No branch statistics available</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
