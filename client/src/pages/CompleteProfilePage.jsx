import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CompleteProfilePage = () => {
  const navigate = useNavigate();

  const { fetchCurrentUser } = useAuth();

  const [scholarId, setScholarId] = useState("");

  const [cgpa, setCgpa] = useState("");

  const [backlogs, setBacklogs] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/complete-profile`,
        {
          scholarId,
          cgpa: Number(cgpa),
          backlogs: Number(backlogs),
        },
        {
          withCredentials: true,
        },
      );

      await fetchCurrentUser();

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "300px",
        }}
      >
        <h1>Complete Profile</h1>

        <input
          type="text"
          placeholder="Scholar ID"
          value={scholarId}
          onChange={(e) => setScholarId(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="CGPA"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          step="0.01"
          min="0"
          max="10"
          required
        />

        <input
          type="number"
          placeholder="Backlogs"
          value={backlogs}
          onChange={(e) => setBacklogs(e.target.value)}
          min="0"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
