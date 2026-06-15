import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, fetchCurrentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    scholarId: "",
    branch: "",
    cgpa: "",
    backlogs: "",
    graduationYear: "",
    class10Percentage: "",
    class12Percentage: "",
    resumeDriveLink: "",
    github: "",
    linkedin: "",
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        scholarId: user.scholarId ?? "",

        branch: user.branch ?? "",

        cgpa: user.cgpa ?? "",

        backlogs: user.backlogs ?? "",

        graduationYear: user.graduationYear ?? "",

        class10Percentage: user.class10Percentage ?? "",

        class12Percentage: user.class12Percentage ?? "",

        resumeDriveLink: user.resumeDriveLink ?? "",

        github: user.github ?? "",

        linkedin: user.linkedin ?? "",

        skills: user.skills ?? [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();

    if (!trimmed) return;

    if (formData.skills.includes(trimmed)) return;

    setFormData({
      ...formData,
      skills: [...formData.skills, trimmed],
    });

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const completion = useMemo(() => {
    const fields = [
      user?.cgpa,
      user?.graduationYear,
      user?.class10Percentage,
      user?.class12Percentage,
      user?.resumeDriveLink,
      user?.github,
      user?.linkedin,
      user?.branch,
      user?.scholarId,
    ];

    const filled = fields.filter(
      (field) => field !== undefined && field !== null && field !== "",
    ).length;

    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,

        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa),

        backlogs:
          formData.backlogs === "" ? undefined : Number(formData.backlogs),

        graduationYear:
          formData.graduationYear === ""
            ? undefined
            : Number(formData.graduationYear),

        class10Percentage:
          formData.class10Percentage === ""
            ? undefined
            : Number(formData.class10Percentage),

        class12Percentage:
          formData.class12Percentage === ""
            ? undefined
            : Number(formData.class12Percentage),
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        payload,
        {
          withCredentials: true,
        },
      );

      await fetchCurrentUser();

      setIsEditing(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error.response);

      alert(error.response?.data?.message || "Failed to update changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div
          className="
  rounded-[2rem]
  bg-[#E9DFD2]
  border
  border-[#DDD2C4]
  p-8
"
        >
          <div className="flex justify-between items-start gap-6 flex-wrap">
            <div>
              <p className="uppercase tracking-[0.18em] text-[#9A876F] text-sm font-semibold">
                Student Profile
              </p>

              <h1 className="text-[2.5rem] font-black text-[#231F1B] mt-3">
                {user?.name}
              </h1>

              <p className="text-[#6D645A] mt-3 text-lg">
                Keep your academic and placement profile updated.
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="
        bg-[#231F1B]
        text-[#F7F2EA]
        px-6
        py-4
        rounded-[1.4rem]
        font-semibold
        hover:opacity-90
        transition-all
      "
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Completion */}
        <div
          className="
  mb-8
  bg-[#FBF7F1]
  border
  border-[#DED3C6]
  rounded-[2rem]
  p-7
"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#231F1B]">
                Profile Completion
              </h2>

              <p className="text-sm text-[#746B60] mt-1">
                Complete your profile to improve placement eligibility.
              </p>
            </div>

            <span className="text-2xl font-black text-[#231F1B]">
              {completion}%
            </span>
          </div>

          <div
            className="
    w-full
    h-4
    rounded-full
    bg-[#E5DACB]
    overflow-hidden
  "
          >
            <div
              className="
      h-full
      bg-[#C27A50]
      transition-all
      duration-500
      rounded-full
    "
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            {/* Basic */}
            <div
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2rem]
      p-7
    "
            >
              <h2 className="text-2xl font-black text-[#231F1B] mb-5">
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Name",
                    value: user?.name,
                  },
                  {
                    label: "Email",
                    value: user?.email,
                  },
                  {
                    label: "Scholar ID",
                    value: user?.scholarId || "Not added",
                  },
                  {
                    label: "Branch",
                    value: user?.branch || "Not added",
                  },
                  {
                    label: "Graduation Year",
                    value: user?.graduationYear || "Not added",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="
      bg-[#F4ECE2]
      border
      border-[#E4D7C8]
      rounded-[1.5rem]
      p-5
    "
                  >
                    <p className="text-sm text-[#8B8072]">{item.label}</p>

                    <h3 className="text-lg font-bold text-[#231F1B] mt-2 break-words">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic */}
            <div
              className="
  bg-[#FBF7F1]
  border
  border-[#DED3C6]
  rounded-[2rem]
  p-7
"
            >
              <h2 className="text-2xl font-black text-[#231F1B] mb-5">
                Academic Information
              </h2>

              <p className="text-[#746B60] mb-6">
                Academic details used for eligibility checks.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    label: "CGPA",
                    value: user?.cgpa ?? "Not added",
                  },
                  {
                    label: "Backlogs",
                    value: user?.backlogs ?? "Not added",
                  },
                  {
                    label: "10th Percentage",
                    value: user?.class10Percentage ?? "Not added",
                  },
                  {
                    label: "12th Percentage",
                    value: user?.class12Percentage ?? "Not added",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="
        bg-[#F4ECE2]
        border
        border-[#E4D7C8]
        rounded-[1.5rem]
        p-5
        transition-all
        duration-300
        hover:shadow-sm
      "
                  >
                    <p className="text-sm text-[#8B8072]">{item.label}</p>

                    <h3 className="text-xl font-bold text-[#231F1B] mt-2">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
            {/* Skills */}
            <div
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2rem]
      p-7
    "
            >
              <h2 className="text-2xl font-black text-[#231F1B] mb-5">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
              bg-[#EFE4D7]
              text-[#5C544B]
              px-5
              py-2
              rounded-full
              font-medium
            "
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[#746B60]">No skills added</p>
                )}
              </div>
            </div>

            {/* Links */}
            <div
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2rem]
      p-7
    "
            >
              <h2 className="text-2xl font-black text-[#231F1B] mb-5">
                Resume & Links
              </h2>

              <div className="flex flex-wrap gap-4">
                {user?.resumeDriveLink && (
                  <a
                    href={user.resumeDriveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
            bg-[#231F1B]
            text-[#F7F2EA]
            px-5
            py-3
            rounded-[1.2rem]
            font-medium
            hover:opacity-90
            transition-all
          "
                  >
                    View Resume
                  </a>
                )}

                {user?.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
            border
            border-[#D8CCBD]
            bg-[#FBF7F1]
            px-5
            py-3
            rounded-[1.2rem]
            hover:bg-[#F3ECE2]
            transition-all
          "
                  >
                    GitHub
                  </a>
                )}

                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="
            border
            border-[#D8CCBD]
            bg-[#FBF7F1]
            px-5
            py-3
            rounded-[1.2rem]
            hover:bg-[#F3ECE2]
            transition-all
          "
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2rem]
      p-7
    "
            >
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="scholarId"
                  placeholder="Scholar ID"
                  value={formData.scholarId}
                  onChange={handleChange}
                  disabled={!!user?.scholarId}
                  className={`
          w-full
          rounded-[1.3rem]
          border
          border-[#DDD1C3]
          bg-[#F9F4ED]
          px-5
          py-4
          outline-none
          ${user?.scholarId ? "opacity-60 cursor-not-allowed" : ""}
        `}
                />

                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={!!user?.branch}
                  className={`
          w-full
          rounded-[1.3rem]
          border
          border-[#DDD1C3]
          bg-[#F9F4ED]
          px-5
          py-4
          outline-none
          ${user?.branch ? "opacity-60 cursor-not-allowed" : ""}
        `}
                >
                  <option value="">Select Branch</option>
                  <option value="CE">CE</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EE">EE</option>
                  <option value="EIE">EIE</option>
                  <option value="ME">ME</option>
                </select>

                {[
                  "cgpa",
                  "backlogs",
                  "graduationYear",
                  "class10Percentage",
                  "class12Percentage",
                  "resumeDriveLink",
                  "github",
                  "linkedin",
                ].map((field) => (
                  <input
                    key={field}
                    type={
                      field.includes("Link") ||
                      field === "github" ||
                      field === "linkedin"
                        ? "url"
                        : "text"
                    }
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="
            w-full
            rounded-[1.3rem]
            border
            border-[#DDD1C3]
            bg-[#F9F4ED]
            px-5
            py-4
            outline-none
          "
                  />
                ))}
              </div>
            </div>

            {/* Skills */}
            <div
              className="
      bg-[#FBF7F1]
      border
      border-[#DED3C6]
      rounded-[2rem]
      p-7
    "
            >
              <h2 className="text-2xl font-black text-[#231F1B] mb-5">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3 mb-5">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="
              bg-[#EFE4D7]
              text-[#5C544B]
              px-5
              py-2
              rounded-full
              flex
              items-center
              gap-2
              font-medium
            "
                  >
                    <span>{skill}</span>

                    <button type="button" onClick={() => removeSkill(skill)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="
          flex-1
          rounded-[1.3rem]
          border
          border-[#DDD1C3]
          bg-[#F9F4ED]
          px-5
          py-4
          outline-none
        "
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="
          bg-[#231F1B]
          text-[#F7F2EA]
          px-6
          rounded-[1.3rem]
          font-medium
        "
                >
                  Add
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="
        bg-[#231F1B]
        text-[#F7F2EA]
        px-7
        py-4
        rounded-[1.3rem]
        font-semibold
      "
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="
        border
        border-[#D8CCBD]
        bg-[#FBF7F1]
        px-7
        py-4
        rounded-[1.3rem]
        hover:bg-[#F3ECE2]
        transition-all
      "
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
