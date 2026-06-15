import axios from "axios";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "@/layout/DashboardLayout";

const EligibleStudentsPage = () => {
  const { companyId } = useParams();

  const [students, setStudents] = useState([]);

  const [company, setCompany] = useState(null);

  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/company/${companyId}/eligible-students`,
          {
            withCredentials: true,
          },
        );

        setStudents(res.data.students);

        setCompany(res.data.company);

        setStats({
          eligible: res.data.totalEligible,

          applied: res.data.totalApplied,

          notApplied: res.data.totalNotApplied,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [companyId]);

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
            Eligibility Overview
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
            {company?.companyName || "Eligible Students"}
          </h1>

          <p
            className="
              text-[#746B60]
              mt-3
              text-lg
              font-medium
            "
          >
            {company?.role || "Placement Drive"}

            {company?.package && <> • {company.package} LPA</>}
          </p>

          <p className="text-[#746B60] mt-2">
            Students eligible for this placement drive and their application
            status.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <div
              className="
                bg-[#F4ECE2]
                border
                border-[#DDD1C3]
                rounded-[1.5rem]
                px-5
                py-4
              "
            >
              <p className="text-sm text-[#746B60]">Eligible</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {stats.eligible || 0}
              </h3>
            </div>

            <div
              className="
                bg-[#F4ECE2]
                border
                border-[#DDD1C3]
                rounded-[1.5rem]
                px-5
                py-4
              "
            >
              <p className="text-sm text-[#746B60]">Applied</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {stats.applied || 0}
              </h3>
            </div>

            <div
              className="
                bg-[#F4ECE2]
                border
                border-[#DDD1C3]
                rounded-[1.5rem]
                px-5
                py-4
              "
            >
              <p className="text-sm text-[#746B60]">Not Applied</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {stats.notApplied || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Students */}
        {loading ? (
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
            Loading...
          </div>
        ) : students.length === 0 ? (
          <div
            className="
              bg-[#FBF7F1]
              border
              border-[#DED3C6]
              rounded-[2rem]
              p-10
              text-center
              text-[#746B60]
            "
          >
            No eligible students found
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="
                    bg-[#FBF7F1]
                    border
                    border-[#DED3C6]
                    rounded-[2rem]
                    p-6
                    transition-all
                    hover:shadow-sm
                  "
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2
                      className="
                          text-[1.55rem]
                          font-black
                          text-[#231F1B]
                          leading-tight
                        "
                    >
                      {student.name}
                    </h2>

                    <p
                      className="
                          text-[#746B60]
                          mt-1
                        "
                    >
                      {student.email}
                    </p>
                  </div>

                  <span
                    className={`px-5 py-2 rounded-full text-sm font-medium ${
                      student.hasApplied
                        ? "bg-green-100 text-green-700"
                        : "bg-[#EFE7DA] text-[#746B60]"
                    }`}
                  >
                    {student.hasApplied ? "Applied" : "Not Applied"}
                  </span>
                </div>

                {/* Student Info */}
                <div
                  className="
                      grid
                      md:grid-cols-3
                      gap-4
                      mt-6
                      bg-[#F4ECE2]
                      border
                      border-[#E2D5C6]
                      rounded-[1.5rem]
                      p-4
                    "
                >
                  <div>
                    <p className="text-sm text-[#7A7166]">Scholar ID</p>

                    <h3 className="font-semibold text-[#231F1B] mt-1">
                      {student.scholarId || "N/A"}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-[#7A7166]">Branch</p>

                    <h3 className="font-semibold text-[#231F1B] mt-1">
                      {student.branch || "N/A"}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-[#7A7166]">CGPA</p>

                    <h3 className="font-semibold text-[#231F1B] mt-1">
                      {student.cgpa ?? "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EligibleStudentsPage;
