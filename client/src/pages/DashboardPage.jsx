import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent } from "@/components/ui/card";

import {
  GraduationCap,
  BadgeAlert,
  Bell,
  BriefcaseBusiness,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);

  const stats = [
    {
      title: "CGPA",
      value: user.cgpa ?? "N/A",
      icon: GraduationCap,
    },
    {
      title: "Backlogs",
      value: user.backlogs ?? "0",
      icon: BadgeAlert,
    },
    {
      title: "Scholar ID",
      value: user.scholarId ?? "N/A",
      icon: BriefcaseBusiness,
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
        return "bg-[#F4E4B8] text-[#8A6500]";

      default:
        return "bg-[#E8DFD1] text-[#5E564D]";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-[#F7F2EA] min-h-screen p-8">
        {/* Welcome Hero */}
        <div
          className="
          relative
          overflow-hidden
          rounded-[2rem]
          bg-[#E9DFD2]
          border
          border-[#DDD2C4]
          p-8
        "
        >
          {/* background glow */}
          <div
            className="
            absolute
            top-[-80px]
            right-[-60px]
            w-[260px]
            h-[260px]
            rounded-full
            bg-[#D08A5A]/20
            blur-[90px]
          "
          />

          <div className="relative z-10">
            <p className="uppercase tracking-[0.18em] text-[#9A876F] text-sm font-semibold">
              Placement Dashboard
            </p>

            <h1 className="text-[2.7rem] font-black text-[#231F1B] mt-3 leading-tight">
              Welcome back,
              <br />
              {user.name}
            </h1>

            <p className="text-[#6E655B] text-lg mt-5 max-w-2xl">
              Track applications, stay updated with placement announcements and
              never miss an opportunity.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="
                rounded-[2rem]
                border-[#DED3C6]
                bg-[#FBF7F1]
                shadow-none
                hover:shadow-md
                transition-all
                duration-300
              "
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#857A6D] text-sm">{stat.title}</p>

                      <h2 className="text-4xl font-black mt-3 text-[#231F1B]">
                        {stat.value}
                      </h2>
                    </div>

                    <div
                      className="
                      w-14 h-14
                      rounded-[1.2rem]
                      bg-[#EFE5D7]
                      flex items-center justify-center
                    "
                    >
                      <Icon className="text-[#A36D4B]" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Placement Status */}
        <Card className="rounded-[2rem] border-[#DED3C6] bg-[#FBF7F1]">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-7">
              <div>
                <p className="uppercase text-sm tracking-[0.18em] text-[#9A876F] font-semibold">
                  Placement Status
                </p>

                <h2 className="text-2xl font-bold text-[#231F1B] mt-2">
                  Your current progress
                </h2>
              </div>

              <span
                className={`px-5 py-3 rounded-full text-sm font-semibold ${
                  user.isPlaced
                    ? "bg-green-100 text-green-700"
                    : "bg-[#ECE2D4] text-[#5D564C]"
                }`}
              >
                {user.isPlaced ? "Placed" : "Unplaced"}
              </span>
            </div>

            {user.isPlaced ? (
              <div className="grid md:grid-cols-3 gap-5">
                <InfoCard label="Company" value={user.placedCompany || "N/A"} />

                <InfoCard
                  label="CTC"
                  value={user.placedCTC ? `${user.placedCTC} LPA` : "N/A"}
                />

                <InfoCard
                  label="Offer Type"
                  value={user.placementType || "N/A"}
                />
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#F2E8DC] border border-[#E2D5C5] p-6">
                <h3 className="text-xl font-bold text-[#231F1B]">
                  Placement season is active
                </h3>

                <p className="text-[#6D645A] mt-2">
                  Keep applying to eligible companies and stay prepared for
                  interviews.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="rounded-[2rem] border-[#DED3C6] bg-[#FBF7F1]">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-[1rem] bg-[#EFE5D7] flex items-center justify-center">
                <Bell className="text-[#A36D4B]" size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#231F1B]">
                  Announcements
                </h2>

                <p className="text-[#6D645A]">Latest placement updates</p>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#F3ECE2] p-6 text-[#6D645A]">
                No announcements yet
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="
                    rounded-[1.5rem]
                    border
                    border-[#E4D9CB]
                    bg-[#F9F5EF]
                    p-5
                  "
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#231F1B]">
                          {announcement.title}
                        </h3>

                        <p className="text-[#6A6158] mt-2 leading-relaxed">
                          {announcement.message}
                        </p>

                        <p className="text-sm text-[#9B8E80] mt-4">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold h-fit ${getPriorityColor(
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

const InfoCard = ({ label, value }) => (
  <div className="rounded-[1.5rem] bg-[#F4ECE2] border border-[#E3D7C9] p-5">
    <p className="text-sm text-[#877C70]">{label}</p>

    <h3 className="text-xl font-bold text-[#231F1B] mt-2">{value}</h3>
  </div>
);

export default DashboardPage;
