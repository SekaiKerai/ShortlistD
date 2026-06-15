import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import { useParams } from "react-router-dom";

const ApplicantsPage = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showEmailModal, setShowEmailModal] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");

  const [emailMessage, setEmailMessage] = useState("");

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

  const handleStatusChange = async (applicationId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/application/${applicationId}/status`,
        {
          status,
        },
        {
          withCredentials: true,
        },
      );

      fetchApplicants();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleBulkMove = async (targetStatus) => {
    if (selectedIds.length === 0) {
      return alert("Select at least one student");
    }

    try {
      // Update selected
      await Promise.all(
        selectedIds.map((id) =>
          axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/application/${id}/status`,
            {
              status: targetStatus,
            },
            {
              withCredentials: true,
            },
          ),
        ),
      );

      // OA auto reject
      if (targetStatus === "oa") {
        const unselected = applicants.filter(
          (app) => !selectedIds.includes(app._id) && app.status === "applied",
        );

        await Promise.all(
          unselected.map((app) =>
            axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/application/${app._id}/status`,
              {
                status: "rejected",
              },
              {
                withCredentials: true,
              },
            ),
          ),
        );
      }

      alert(`Moved students to ${targetStatus.toUpperCase()}`);

      setSelectedIds([]);

      fetchApplicants();
    } catch (error) {
      alert(error.response?.data?.message || "Bulk update failed");
    }
  };

  const handleSendEmail = async () => {
    if (selectedIds.length === 0) {
      return alert("Select students first");
    }

    try {
      const studentIds = applicants
        .filter((app) => selectedIds.includes(app._id))
        .map((app) => app.student._id);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/email/bulk`,
        {
          studentIds,
          subject: emailSubject,
          message: emailMessage,
        },
        {
          withCredentials: true,
        },
      );

      alert("Emails sent successfully");

      setShowEmailModal(false);
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Email failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "interview":
        return "bg-blue-100 text-blue-700";

      case "oa":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
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

        {/* Bulk Actions */}
        <div className="bg-white border rounded-3xl p-4 flex flex-wrap gap-3">
          <button
            onClick={() => handleBulkMove("oa")}
            className="bg-purple-600 text-white px-5 py-2 rounded-xl"
          >
            Move to OA
          </button>

          <button
            onClick={() => handleBulkMove("interview")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Move to Interview
          </button>

          <button
            onClick={() => handleBulkMove("selected")}
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            Mark Selected
          </button>

          <button
            onClick={() => handleBulkMove("rejected")}
            className="bg-red-600 text-white px-5 py-2 rounded-xl"
          >
            Reject Selected
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl"
          >
            Send Email
          </button>
        </div>

        <input
          type="text"
          placeholder="Search name, scholar ID or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-2xl p-4"
        />

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[500px] space-y-4">
              <h2 className="text-2xl font-bold">Send Email</h2>

              <input
                type="text"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              <textarea
                rows={5}
                placeholder="Message..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="border px-5 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendEmail}
                  className="bg-slate-900 text-white px-5 py-2 rounded-xl"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

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
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(application._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [
                              ...prev,
                              application._id,
                            ]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== application._id),
                            );
                          }
                        }}
                        className="mt-2 w-5 h-5"
                      />

                      <div>
                        <h2 className="text-xl font-bold">{student?.name}</h2>

                        <p className="text-slate-500">{student?.email}</p>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status.toUpperCase()}
                    </span>
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

                  <div className="mt-5 flex gap-3">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleStatusChange(application._id, e.target.value)
                      }
                      className="border rounded-xl p-3"
                    >
                      <option value="applied">Applied</option>
                      <option value="oa">OA</option>
                      <option value="interview">Interview</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDebar(application._id)}
                      className="bg-red-600 text-white px-4 rounded-xl"
                    >
                      Debar
                    </button>
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
