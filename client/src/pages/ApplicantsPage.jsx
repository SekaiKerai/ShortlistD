import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

import { useParams } from "react-router-dom";

const ApplicantsPage = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);

  const [applicants, setApplicants] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/application/company/${companyId}`,
        {
          withCredentials: true,
        },
      );

      setCompany(res.data.company);

      setApplicants(res.data.applications);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [companyId]);

  const handleDebar = async (applicationId) => {
    const confirmed = window.confirm("Remove this student application?");

    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/application/${applicationId}`,
        {
          withCredentials: true,
        },
      );

      alert("Application removed successfully");

      fetchApplicants();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove application");
    }
  };

  const filteredApplicants = applicants.filter((application) => {
    const student = application.student;

    const term = search.toLowerCase();

    return (
      student?.name?.toLowerCase().includes(term) ||
      student?.email?.toLowerCase().includes(term) ||
      student?.scholarId?.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>

          <p className="text-slate-500 mt-1">
            {company?.companyName} — {company?.role}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search name, scholar ID or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-2xl p-4"
        />

        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading...
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-3xl border p-10 text-center text-slate-500">
            No applicants found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((application) => {
              const student = application.student;

              return (
                <div
                  key={application._id}
                  className="bg-white border rounded-3xl p-6 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{student?.name}</h2>

                      <p className="text-slate-500">{student?.email}</p>
                    </div>

                    <button
                      onClick={() => handleDebar(application._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      Debar
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
                    <p>
                      <strong>Scholar ID:</strong> {student?.scholarId || "N/A"}
                    </p>

                    <p>
                      <strong>Branch:</strong> {student?.branch || "N/A"}
                    </p>

                    <p>
                      <strong>CGPA:</strong> {student?.cgpa ?? "N/A"}
                    </p>
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

export default ApplicantsPage;
