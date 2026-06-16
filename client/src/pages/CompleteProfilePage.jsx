import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const branches = ["CE", "CSE", "ECE", "EE", "EIE", "ME"];

const graduationYears = [2027, 2028, 2029];

const CompleteProfilePage = () => {
  const navigate = useNavigate();

  const { user, fetchCurrentUser } = useAuth();

  const [scholarId, setScholarId] = useState("");

  const [branch, setBranch] = useState("");

  const [graduationYear, setGraduationYear] = useState("");

  const [cgpa, setCgpa] = useState("");

  const [backlogs, setBacklogs] = useState(0);

  const [loading, setLoading] = useState(false);

  const [switchingAccount, setSwitchingAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/complete-profile`,
        {
          scholarId,
          branch,
          graduationYear: Number(graduationYear),
          cgpa: Number(cgpa),
          backlogs: Number(backlogs),
        },
        {
          withCredentials: true,
        },
      );

      await fetchCurrentUser();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

const handleSwitchAccount = async () => {
  try {
    setSwitchingAccount(true);

    // cleanup incomplete profile
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/user/cleanup-profile`,
      {
        withCredentials: true,
      },
    );

    // logout
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    // hard redirect
    window.location.href = "/login";
  } catch (error) {
    console.log(error);

    alert("Failed to switch account");
  } finally {
    setSwitchingAccount(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F4EFE7] flex justify-center items-center px-5 py-10">
      <div
        className="
          w-full
          max-w-2xl
          bg-[#FBF7F1]
          border
          border-[#DDD1C3]
          rounded-[2.5rem]
          p-10
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        "
      >
        <p className="uppercase tracking-[0.18em] text-sm text-[#9A876F] font-semibold">
          Student Setup
        </p>

        <h1 className="text-[3rem] font-black text-[#231F1B] leading-none mt-4">
          Complete your profile
        </h1>

        <p className="text-[#746B60] text-lg mt-4">
          Complete your profile to unlock placement drives and applications.
        </p>

        <div className="mt-6 bg-[#F4ECE2] border border-[#DDD1C3] rounded-[1.5rem] p-5">
          <p className="text-sm text-[#6B645B]">Currently signed in as:</p>

          <p className="font-semibold text-[#231F1B] mt-1">{user?.email}</p>

          <button
            type="button"
            onClick={handleSwitchAccount}
            disabled={switchingAccount}
            className="
                mt-4
                text-sm
                underline
                text-[#8A7762]
                hover:text-[#231F1B]
              "
          >
            {switchingAccount
              ? "Switching account..."
              : "Use a different account"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="text-sm font-medium text-[#5E564D]">
              Scholar ID
            </label>

            <input
              type="text"
              required
              value={scholarId}
              onChange={(e) => setScholarId(e.target.value)}
              className="w-full mt-2 border border-[#DDD1C3] rounded-[1.2rem] px-5 py-4 bg-white"
              placeholder="2312176"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5E564D]">Branch</label>

            <div className="flex flex-wrap gap-3 mt-3">
              {branches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBranch(item)}
                  className={`px-5 py-3 rounded-[1.2rem] border transition-all ${
                    branch === item
                      ? "bg-[#231F1B] text-white border-[#231F1B]"
                      : "bg-white border-[#DDD1C3]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#5E564D]">
              Graduation Year
            </label>

            <div className="flex gap-3 mt-3">
              {graduationYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setGraduationYear(year)}
                  className={`px-5 py-3 rounded-[1.2rem] border transition-all ${
                    graduationYear === year
                      ? "bg-[#231F1B] text-white border-[#231F1B]"
                      : "bg-white border-[#DDD1C3]"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-[#5E564D]">CGPA</label>

              <input
                type="number"
                required
                min="0"
                max="10"
                step="0.01"
                placeholder="8.50"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full mt-2 border border-[#DDD1C3] rounded-[1.2rem] px-5 py-4 bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#5E564D]">
                Backlogs
              </label>

              <input
                type="number"
                required
                min="0"
                value={backlogs}
                onChange={(e) => setBacklogs(e.target.value)}
                className="w-full mt-2 border border-[#DDD1C3] rounded-[1.2rem] px-5 py-4 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !branch || !graduationYear}
            className="w-full bg-[#231F1B] text-white py-5 rounded-[1.5rem] font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
