import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "@/layout/DashboardLayout";

const ApplicantsPage = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchApplicants();
  }, [companyId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>

          <p className="text-slate-500 mt-1">
            {company?.companyName} — {company?.role}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            Loading...
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white rounded-3xl border p-10 text-center text-slate-500">
            No applicants yet
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((application) => {
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

                    <span className="bg-slate-100 px-4 py-2 rounded-full text-sm">
                      {application.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-5 text-sm">
                    <p>
                      <strong>Scholar ID:</strong> {student?.scholarId || "N/A"}
                    </p>

                    <p>
                      <strong>Branch:</strong> {student?.branch || "N/A"}
                    </p>

                    <p>
                      <strong>CGPA:</strong> {student?.cgpa ?? "N/A"}
                    </p>

                    <p>
                      <strong>Applied:</strong>{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-5 flex-wrap">
                    {student?.resumeDriveLink && (
                      <a
                        href={student.resumeDriveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl"
                      >
                        Resume
                      </a>
                    )}

                    {student?.github && (
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        className="border px-4 py-2 rounded-xl"
                      >
                        Github
                      </a>
                    )}

                    {student?.linkedin && (
                      <a
                        href={student.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="border px-4 py-2 rounded-xl"
                      >
                        LinkedIn
                      </a>
                    )}
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
