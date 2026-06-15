import axios from "axios";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "@/layout/DashboardLayout";

const EligibleStudentsPage = () => {
  const { companyId } = useParams();

  const [students, setStudents] = useState([]);

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
        <div>
          <h1 className="text-3xl font-bold">Eligible Students</h1>

          <p className="text-slate-500 mt-1">
            Students eligible for this company
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border p-6">
            <p className="text-slate-500 text-sm">Eligible</p>

            <h2 className="text-3xl font-bold mt-2">{stats.eligible}</h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-slate-500 text-sm">Applied</p>

            <h2 className="text-3xl font-bold mt-2">{stats.applied}</h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-slate-500 text-sm">Not Applied</p>

            <h2 className="text-3xl font-bold mt-2">{stats.notApplied}</h2>
          </div>
        </div>

        {/* Students */}
        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white border rounded-3xl p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{student.name}</h2>

                    <p className="text-slate-500">{student.email}</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm ${
                      student.hasApplied
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.hasApplied ? "Applied" : "Not Applied"}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
                  <p>
                    <strong>Scholar ID:</strong> {student.scholarId || "N/A"}
                  </p>

                  <p>
                    <strong>Branch:</strong> {student.branch || "N/A"}
                  </p>

                  <p>
                    <strong>CGPA:</strong> {student.cgpa ?? "N/A"}
                  </p>
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
