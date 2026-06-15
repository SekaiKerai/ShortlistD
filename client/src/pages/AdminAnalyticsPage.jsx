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
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>

          <p className="text-slate-500 mt-1">Placement insights</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Total Students</h2>

            <p className="text-3xl font-bold mt-2">{analytics.totalStudents}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Placed Students</h2>

            <p className="text-3xl font-bold mt-2">{analytics.placedCount}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Placement %</h2>

            <p className="text-3xl font-bold mt-2">
              {analytics.placementPercentage}%
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Average CTC</h2>

            <p className="text-3xl font-bold mt-2">
              {analytics.averageCTC} LPA
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Median CTC</h2>

            <p className="text-3xl font-bold mt-2">{analytics.medianCTC} LPA</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <h2 className="text-slate-500">Highest Package</h2>

            <p className="text-3xl font-bold mt-2">
              {analytics.highestCTC} LPA
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border">
          <h2 className="text-xl font-semibold mb-5">Branch-wise Placements</h2>

          <div className="space-y-4">
            {Object.entries(analytics.branchStats).map(([branch, data]) => (
              <div key={branch} className="flex justify-between border-b pb-3">
                <span className="font-medium">{branch}</span>

                <span>
                  {data.placed}/{data.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
