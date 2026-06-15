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
            Applicant Pipeline
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
            {company?.companyName}
          </h1>

          <p
            className="
    text-[#746B60]
    text-xl
    font-medium
    mt-3
  "
          >
            {company?.role}
          </p>

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
              <p className="text-sm text-[#746B60]">Total Applicants</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {applicants.length}
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
              <p className="text-sm text-[#746B60]">Selected</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {applicants.filter((a) => a.status === "selected").length}
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
              <p className="text-sm text-[#746B60]">In Process</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {
                  applicants.filter(
                    (a) => !["selected", "rejected"].includes(a.status),
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div
          className="
  bg-[#FBF7F1]
  border
  border-[#DED3C6]
  rounded-[2rem]
  p-5
"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p
                className="
        text-sm
        uppercase
        tracking-[0.14em]
        text-[#9A876F]
        font-semibold
      "
              >
                Bulk Actions
              </p>

              <h2
                className="
        text-xl
        font-black
        text-[#231F1B]
        mt-1
      "
              >
                {selectedIds.length} Selected
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBulkMove("oa")}
                className="
        bg-purple-600
        text-white
        px-5
        py-3
        rounded-[1.2rem]
        font-medium
        hover:opacity-90
        transition-all
      "
              >
                Move to OA
              </button>

              <button
                onClick={() => handleBulkMove("interview")}
                className="
        bg-blue-600
        text-white
        px-5
        py-3
        rounded-[1.2rem]
        font-medium
        hover:opacity-90
        transition-all
      "
              >
                Interview
              </button>

              <button
                onClick={() => handleBulkMove("selected")}
                className="
        bg-green-600
        text-white
        px-5
        py-3
        rounded-[1.2rem]
        font-medium
        hover:opacity-90
        transition-all
      "
              >
                Select
              </button>

              <button
                onClick={() => handleBulkMove("rejected")}
                className="
        bg-red-600
        text-white
        px-5
        py-3
        rounded-[1.2rem]
        font-medium
        hover:opacity-90
        transition-all
      "
              >
                Reject
              </button>

              <button
                onClick={() => setShowEmailModal(true)}
                className="
        bg-[#231F1B]
        text-white
        px-5
        py-3
        rounded-[1.2rem]
        font-medium
        hover:opacity-90
        transition-all
      "
              >
                Send Email
              </button>
            </div>
          </div>
        </div>

        <div
          className="
  bg-[#FBF7F1]
  border
  border-[#DED3C6]
  rounded-[2rem]
  p-5
"
        >
          <p
            className="
    text-sm
    uppercase
    tracking-[0.14em]
    text-[#9A876F]
    font-semibold
    mb-3
  "
          >
            Search Applicants
          </p>

          <input
            type="text"
            placeholder="Search by name, scholar ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
    w-full
    rounded-[1.2rem]
    border
    border-[#DDD1C3]
    bg-[#F8F3EC]
    px-5
    py-4
    outline-none
    text-[#231F1B]
    placeholder:text-[#9A8E81]
    focus:border-[#C9A784]
    transition-all
  "
          />
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div
            onClick={() => setShowEmailModal(false)}
            className="
    fixed
    inset-0
    bg-black/35
    backdrop-blur-[4px]
    flex
    justify-center
    items-center
    z-50
    px-4
  "
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2.5rem]
      p-8
      w-full
      max-w-[600px]
      shadow-xl
    "
            >
              {/* Header */}
              <div className="mb-6">
                <p
                  className="
          text-sm
          uppercase
          tracking-[0.16em]
          text-[#9A876F]
          font-semibold
        "
                >
                  Email Communication
                </p>

                <h2
                  className="
          text-[2rem]
          font-black
          text-[#231F1B]
          mt-2
        "
                >
                  Send Email
                </h2>

                <p className="text-[#746B60] mt-2">
                  Notify selected applicants with a custom message.
                </p>
              </div>

              {/* Subject */}
              <div className="mb-5">
                <label
                  className="
          block
          text-sm
          font-semibold
          text-[#231F1B]
          mb-2
        "
                >
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="
          w-full
          rounded-[1.2rem]
          border
          border-[#DDD1C3]
          bg-[#F8F3EC]
          px-5
          py-4
          outline-none
          focus:border-[#C9A784]
          transition-all
        "
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="
          block
          text-sm
          font-semibold
          text-[#231F1B]
          mb-2
        "
                >
                  Message
                </label>

                <textarea
                  rows={7}
                  placeholder="Write your message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="
          w-full
          rounded-[1.4rem]
          border
          border-[#DDD1C3]
          bg-[#F8F3EC]
          px-5
          py-4
          outline-none
          resize-none
          focus:border-[#C9A784]
          transition-all
        "
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="
          border
          border-[#D5C7B7]
          text-[#231F1B]
          px-6
          py-3
          rounded-[1.2rem]
          font-medium
          hover:bg-[#F4ECE2]
          transition-all
        "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendEmail}
                  className="
          bg-[#231F1B]
          text-white
          px-6
          py-3
          rounded-[1.2rem]
          font-medium
          hover:opacity-90
          transition-all
        "
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}

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
        ) : filteredApplicants.length === 0 ? (
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
            No applicants found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((application) => {
              const student = application.student;

              return (
                <div
                  key={application._id}
                  className={`
          border
          rounded-[2rem]
          p-6
          transition-all
          duration-300
          ${
            selectedIds.includes(application._id)
              ? "bg-[#F2E8DB] border-[#C9AE91] shadow-md"
              : "bg-[#FBF7F1] border-[#DED3C6] hover:shadow-sm"
          }
        `}
                >
                  {/* Header */}
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
                        className="
                mt-2
                w-5
                h-5
                accent-[#231F1B]
                cursor-pointer
              "
                      />

                      <div>
                        <h2
                          className="
                  text-[1.55rem]
                  font-black
                  text-[#231F1B]
                  leading-tight
                "
                        >
                          {student?.name}
                        </h2>

                        <p
                          className="
                  text-[#746B60]
                  mt-1
                "
                        >
                          {student?.email}
                        </p>
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
                        {student?.scholarId || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm text-[#7A7166]">Branch</p>

                      <h3 className="font-semibold text-[#231F1B] mt-1">
                        {student?.branch || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm text-[#7A7166]">CGPA</p>

                      <h3 className="font-semibold text-[#231F1B] mt-1">
                        {student?.cgpa ?? "N/A"}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 flex-wrap">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleStatusChange(application._id, e.target.value)
                      }
                      className="
              rounded-[1rem]
              border
              border-[#DDD1C3]
              bg-[#F8F3EC]
              px-4
              py-3
              outline-none
            "
                    >
                      <option value="applied">Applied</option>

                      <option value="oa">OA</option>

                      <option value="interview">Interview</option>

                      <option value="selected">Selected</option>

                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDebar(application._id)}
                      className="
              bg-red-600
              text-white
              px-5
              rounded-[1rem]
              font-medium
              hover:opacity-90
              transition-all
            "
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
