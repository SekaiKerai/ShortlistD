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
      <div className="max-w-4xl mx-auto bg-white border rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>

            <p className="text-slate-500 mt-1">Manage your profile</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-900 text-white px-5 py-2 rounded-xl"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Completion */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Profile Completion</span>

            <span className="font-semibold">{completion}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all"
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-8">
            {/* Basic */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>

                <p>
                  <strong>Email:</strong> {user?.email}
                </p>

                <p>
                  <strong>Scholar ID:</strong> {user?.scholarId || "Not added"}
                </p>
                <p>
                  <strong>Branch:</strong> {user?.branch || "Not added"}
                </p>
                <p>
                  <strong>Graduation Year:</strong>{" "}
                  {user?.graduationYear || "Not added"}
                </p>
              </div>
            </div>

            {/* Academic */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Academic</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <p>
                  <strong>CGPA:</strong> {user?.cgpa ?? "Not added"}
                </p>

                <p>
                  <strong>Backlogs:</strong> {user?.backlogs ?? "Not added"}
                </p>

                <p>
                  <strong>10th %:</strong>{" "}
                  {user?.class10Percentage ?? "Not added"}
                </p>

                <p>
                  <strong>12th %:</strong>{" "}
                  {user?.class12Percentage ?? "Not added"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Skills</h2>

              <div className="flex flex-wrap gap-2">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-900 text-white px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">No skills added</p>
                )}
              </div>
            </div>

            {/* Links */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Resume & Links</h2>

              <div className="flex flex-wrap gap-3">
                {user?.resumeDriveLink && (
                  <a
                    href={user.resumeDriveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl"
                  >
                    View Resume
                  </a>
                )}

                {user?.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="border px-4 py-2 rounded-xl"
                  >
                    GitHub
                  </a>
                )}

                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="border px-4 py-2 rounded-xl"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="scholarId"
                placeholder="Scholar ID"
                value={formData.scholarId}
                onChange={handleChange}
                disabled={!!user?.scholarId}
                className={`border rounded-xl p-3 ${
                  user?.scholarId ? "bg-slate-100 cursor-not-allowed" : ""
                }`}
              />

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={!!user?.branch}
                className={`border rounded-xl p-3 ${
                  user?.branch ? "bg-slate-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select Branch</option>

                <option value="CE">CE</option>

                <option value="CSE">CSE</option>

                <option value="ECE">ECE</option>

                <option value="EE">EE</option>

                <option value="EIE">EIE</option>

                <option value="ME">ME</option>
              </select>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                placeholder="CGPA"
                value={formData.cgpa}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="number"
                name="backlogs"
                placeholder="Backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="number"
                name="graduationYear"
                placeholder="Graduation Year"
                value={formData.graduationYear}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="number"
                step="0.01"
                name="class10Percentage"
                placeholder="10th %"
                value={formData.class10Percentage}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="number"
                step="0.01"
                name="class12Percentage"
                placeholder="12th %"
                value={formData.class12Percentage}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="url"
                name="resumeDriveLink"
                placeholder="Resume Link"
                value={formData.resumeDriveLink}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="url"
                name="github"
                placeholder="GitHub"
                value={formData.github}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />

              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn"
                value={formData.linkedin}
                onChange={handleChange}
                className="border rounded-xl p-3"
              />
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Skills</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-slate-900 text-white px-4 py-2 rounded-full flex items-center gap-2"
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
                  className="border rounded-xl p-3 flex-1"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-slate-900 text-white px-5 rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border px-6 py-3 rounded-xl"
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
