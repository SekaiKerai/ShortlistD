import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);

  const stats = [
    {
      title: "CGPA",
      value: user.cgpa ?? "N/A",
    },
    {
      title: "Backlogs",
      value: user.backlogs ?? "0",
    },
    {
      title: "Scholar ID",
      value: user.scholarId ?? "N/A",
    },
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/announcement`,
          {
            withCredentials: true,
          },
        );

        setAnnouncements(res.data.announcements);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";

      case "important":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold">Welcome back, {user.name}</h1>

          <p className="text-slate-300 mt-3 text-lg">
            Stay updated with placement opportunities and application progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="rounded-2xl border border-slate-200 shadow-sm"
            >
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">{stat.title}</p>

                <h2 className="text-3xl font-bold mt-2 text-slate-900">
                  {stat.value}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placement Status */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Placement Status</h2>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.isPlaced
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {user.isPlaced ? "Placed" : "Unplaced"}
              </span>
            </div>

            {user.isPlaced ? (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-slate-500 text-sm">Company</p>

                  <p className="font-semibold text-lg">
                    {user.placedCompany || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">CTC</p>

                  <p className="font-semibold text-lg">
                    {user.placedCTC ? `${user.placedCTC} LPA` : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Offer Type</p>

                  <p className="font-semibold text-lg uppercase">
                    {user.placementType || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 border p-5">
                <p className="text-lg font-medium text-slate-700">
                  Unplaced till now
                </p>

                <p className="text-slate-500 mt-2">
                  Keep applying to eligible companies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Latest Announcements</h2>
            </div>

            {announcements.length === 0 ? (
              <p className="text-slate-500">No announcements yet</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="border rounded-2xl p-5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {announcement.title}
                        </h3>

                        <p className="text-slate-600 mt-2">
                          {announcement.message}
                        </p>

                        <p className="text-sm text-slate-400 mt-3">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-2 rounded-full text-xs font-medium ${getPriorityColor(
                          announcement.priority,
                        )}`}
                      >
                        {announcement.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
