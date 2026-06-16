import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const branches = ["CE", "CSE", "ECE", "EE", "EIE", "ME"];

const graduationYears = [2027, 2028, 2029];

const CompleteProfilePage = () => {
  const navigate = useNavigate();

  const { fetchCurrentUser } = useAuth();

  const [scholarId, setScholarId] = useState("");

  const [branch, setBranch] = useState("");

  const [graduationYear, setGraduationYear] = useState("");

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

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE7] flex justify-center items-center px-5">
      <div
        className="
          w-full
          max-w-2xl
          bg-[#FBF7F1]
          border
          border-[#DDD1C3]
          rounded-[2.5rem]
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          p-10
        "
      >
        <p
          className="
            uppercase
            tracking-[0.22em]
            text-sm
            text-[#9A876F]
            font-semibold
          "
        >
          One Final Step
        </p>

        <h1
          className="
            text-[3rem]
            font-black
            text-[#231F1B]
            leading-none
            mt-4
          "
        >
          Complete your profile
        </h1>

        <p className="text-[#746B60] mt-4 text-lg">
          Complete your academic details to unlock placement opportunities.
        </p>

        <div
          className="
            mt-6
            bg-[#F4ECE2]
            border
            border-[#DDD1C3]
            rounded-[1.5rem]
            p-5
          "
        >
          <p className="text-[#6B645B] text-sm">
            Required before you can access placement drives and apply to
            companies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-[#5E564D]">
              Scholar ID
            </label>

            <input
              type="text"
              placeholder="Enter scholar ID"
              value={scholarId}
              onChange={(e) => setScholarId(e.target.value)}
              required
              className="
                w-full
                mt-2
                border
                border-[#DDD1C3]
                rounded-[1.2rem]
                px-5
                py-4
                bg-white
                outline-none
              "
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
                  className={`
                      px-5
                      py-3
                      rounded-[1.2rem]
                      border
                      transition-all
                      ${
                        branch === item
                          ? "bg-[#231F1B] text-white border-[#231F1B]"
                          : "bg-white border-[#DDD1C3] text-[#5E564D]"
                      }
                    `}
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

            <div className="flex gap-3 mt-3 flex-wrap">
              {graduationYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setGraduationYear(year)}
                  className={`
                      px-5
                      py-3
                      rounded-[1.2rem]
                      border
                      transition-all
                      ${
                        graduationYear === year
                          ? "bg-[#231F1B] text-white border-[#231F1B]"
                          : "bg-white border-[#DDD1C3] text-[#5E564D]"
                      }
                    `}
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
                placeholder="8.50"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                min="0"
                max="10"
                step="0.01"
                required
                className="
                  w-full
                  mt-2
                  border
                  border-[#DDD1C3]
                  rounded-[1.2rem]
                  px-5
                  py-4
                  bg-white
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#5E564D]">
                Backlogs
              </label>

              <input
                type="number"
                value={backlogs}
                onChange={(e) => setBacklogs(e.target.value)}
                min="0"
                required
                className="
                  w-full
                  mt-2
                  border
                  border-[#DDD1C3]
                  rounded-[1.2rem]
                  px-5
                  py-4
                  bg-white
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !branch || !graduationYear}
            className="
              w-full
              mt-4
              bg-[#231F1B]
              text-white
              py-5
              rounded-[1.5rem]
              font-semibold
              text-lg
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
