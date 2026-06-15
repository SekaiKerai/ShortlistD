import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

import {
  Search,
  BriefcaseBusiness,
  Clock3,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

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
        return "bg-[#E8E1D6] text-[#8A633B]";

      case "oa":
        return "bg-[#F4E7D8] text-[#A05E2A]";

      default:
        return "bg-[#EAE1D5] text-[#5D564C]";
    }
  };

  const getStageText = (status) => {
    switch (status) {
      case "oa":
        return "Online Assessment";

      case "interview":
        return "Interview Round";

      case "selected":
        return "Selected 🎉";

      case "rejected":
        return "Rejected";

      default:
        return "Application Submitted";
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

  const statCards = [
    {
      title: "Applications",
      value: stats.total,
      icon: BriefcaseBusiness,
    },
    {
      title: "In Process",
      value: stats.inProcess,
      icon: Clock3,
    },
    {
      title: "Selected",
      value: stats.selected,
      icon: CircleCheckBig,
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: CircleX,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div
          className="
          rounded-[2rem]
          bg-[#E9DFD2]
          border
          border-[#DDD2C4]
          p-8
        "
        >
          <p className="uppercase tracking-[0.18em] text-[#9A876F] text-sm font-semibold">
            Placement Journey
          </p>

          <h1 className="text-[2.5rem] font-black text-[#231F1B] mt-3">
            My Applications
          </h1>

          <p className="text-[#6D645A] mt-3 text-lg">
            Track every placement drive, interview and selection update.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="
                  rounded-[2rem]
                  bg-[#FBF7F1]
                  border
                  border-[#DED3C6]
                  p-6
                "
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-[#7A7064]">{card.title}</p>

                    <h2 className="text-4xl font-black text-[#231F1B] mt-3">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className="
                      w-14 h-14
                      rounded-[1.2rem]
                      bg-[#EFE5D7]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon size={24} className="text-[#B67542]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div
          className="
          relative
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[1.8rem]
          p-2
        "
        >
          <Search
            size={20}
            className="
            absolute
            left-6
            top-1/2
            -translate-y-1/2
            text-[#9B8F81]
          "
          />

          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full
            bg-transparent
            pl-14
            pr-4
            py-4
            outline-none
          "
          />
        </div>

        {/* Cards */}
        {loading ? (
          <div
            className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-14
            text-center
          "
          >
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div
            className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-14
            text-center
          "
          >
            <h3 className="text-xl font-bold text-[#231F1B]">
              No applications found
            </h3>

            <p className="text-[#6F675C] mt-2">Try changing your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApplications.map((application) => {
              const company = application.company;

              return (
                <div
                  key={application._id}
                  className="
                    bg-[#FBF7F1]
                    border
                    border-[#DED3C6]
                    rounded-[2rem]
                    p-6
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2
                        className="
  text-[1.55rem]
  font-black
  text-[#231F1B]
  leading-tight
"
                      >
                        {company?.companyName}
                      </h2>

                      <p
                        className="
  text-[#6F655B]
  mt-2
  text-lg
  font-medium
"
                      >
                        {company?.role}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold h-fit ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 text-[#5F574E]">
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

                  {/* Timeline */}
                  <div
                    className="
                      mt-6
                      rounded-[1.5rem]
                      bg-[#F3EBE0]
                      border
                      border-[#E4D8CA]
                      p-5
                    "
                  >
                    <p className="text-sm text-[#7A7064]">Current Stage</p>

                    <h3 className="text-lg font-bold text-[#231F1B] mt-2">
                      {getStageText(application.status)}
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
