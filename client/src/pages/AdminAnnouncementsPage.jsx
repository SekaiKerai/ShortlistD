import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const AdminAnnouncementsPage = () => {
  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [priority, setPriority] = useState("normal");

  const [loading, setLoading] = useState(false);

  const [announcements, setAnnouncements] = useState([]);

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/announcement`,
        {
          title,
          message,
          priority,
        },
        {
          withCredentials: true,
        },
      );

      alert("Announcement posted");

      setTitle("");

      setMessage("");

      setPriority("normal");

      fetchAnnouncements();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete announcement?");

    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/announcement/${id}`,
        {
          withCredentials: true,
        },
      );

      fetchAnnouncements();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";

      case "important":
        return "bg-amber-100 text-amber-700 border-amber-200";

      default:
        return "bg-[#EFE4D7] text-[#6B6157] border-[#DED3C6]";
    }
  };

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
            Placement Communication
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
            Announcements
          </h1>

          <p className="text-[#746B60] mt-4 text-lg">
            Share placement updates, deadlines and important notices with
            students.
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
              <p className="text-sm text-[#746B60]">Total Posts</p>

              <h3 className="text-2xl font-black text-[#231F1B]">
                {announcements.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Create Announcement */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            rounded-[2rem]
            p-8
            space-y-5
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-black
                text-[#231F1B]
              "
            >
              Create Announcement
            </h2>

            <p className="text-[#746B60] mt-1">Post updates for students.</p>
          </div>

          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              border
              border-[#DED3C6]
              bg-white
              rounded-[1.5rem]
              p-4
              outline-none
            "
            required
          />

          <textarea
            placeholder="Write announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="
              w-full
              border
              border-[#DED3C6]
              bg-white
              rounded-[1.5rem]
              p-4
              resize-none
              outline-none
            "
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="
              w-full
              border
              border-[#DED3C6]
              bg-white
              rounded-[1.5rem]
              p-4
            "
          >
            <option value="normal">Normal</option>

            <option value="important">Important</option>

            <option value="urgent">Urgent</option>
          </select>

          <button
            disabled={loading}
            className="
              bg-[#231F1B]
              text-[#F7F2EA]
              px-8
              py-4
              rounded-[1.5rem]
              font-semibold
              hover:opacity-90
              transition-all
            "
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </form>

        {/* Previous Announcements */}
        <div className="space-y-4">
          <div>
            <h2
              className="
                text-2xl
                font-black
                text-[#231F1B]
              "
            >
              Previous Announcements
            </h2>

            <p className="text-[#746B60] mt-1">
              Recent updates sent to students.
            </p>
          </div>

          {announcements.length === 0 ? (
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
              No announcements posted yet
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item._id}
                  className="
                      bg-[#FBF7F1]
                      border
                      border-[#DED3C6]
                      rounded-[2rem]
                      p-6
                    "
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className="
                              text-xl
                              font-black
                              text-[#231F1B]
                            "
                        >
                          {item.title}
                        </h3>

                        <span
                          className={`px-4 py-2 rounded-full text-sm border font-medium ${getPriorityStyle(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <p className="text-[#5F574E] mt-4 leading-relaxed">
                        {item.message}
                      </p>

                      <p className="text-sm text-[#8A8176] mt-4">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="
                          bg-red-600
                          text-white
                          px-5
                          py-3
                          rounded-[1.2rem]
                          h-fit
                        "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnnouncementsPage;
