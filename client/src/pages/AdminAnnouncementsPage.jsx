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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>

          <p className="text-slate-500 mt-1">Manage placement updates</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-3xl p-8 shadow-sm space-y-5"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-2xl p-4"
            required
          />

          <textarea
            placeholder="Announcement message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border rounded-2xl p-4 resize-none"
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-2xl p-4"
          >
            <option value="normal">Normal</option>

            <option value="important">Important</option>

            <option value="urgent">Urgent</option>
          </select>

          <button
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl"
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Previous Announcements</h2>

          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-3xl p-5 flex justify-between gap-5"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <p className="text-slate-600 mt-2">{item.message}</p>

                <p className="text-sm text-slate-400 mt-3">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 text-white px-5 py-2 rounded-xl h-fit"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnnouncementsPage;
