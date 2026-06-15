import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [companySearch, setCompanySearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    try {
      const [studentRes, companyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/students`, {
          withCredentials: true,
        }),

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/company`, {
          withCredentials: true,
        }),
      ]);

      setStudents(studentRes.data.students);

      setCompanies(companyRes.data.companies);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchLower = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.scholarId?.toLowerCase().includes(searchLower) ||
      student.branch?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (student) => {
    setEditingId(student._id);

    setCompanySearch(student.placedCompany || "");

    setEditData({
      scholarId: student.scholarId || "",

      branch: student.branch || "",

      cgpa: student.cgpa || "",

      backlogs: student.backlogs || 0,

      isPlaced: student.isPlaced || false,

      placedCompany: student.placedCompany || "",

      placedCTC: student.placedCTC || "",

      placementType: student.placementType || "fte",

      placedRole: student.placedRole || "",
    });
  };

  const handleCompanySelect = (company) => {
    setCompanySearch(company.companyName);

    setEditData({
      ...editData,
      placedCompany: company.companyName,
      placedCTC: company.package,
      placementType: company.offerType,
      placedRole: company.role,
    });
  };

  const handleSave = async (studentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/students/${studentId}`,
        editData,
        {
          withCredentials: true,
        },
      );

      alert("Student updated successfully");

      setEditingId(null);

      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(companySearch.toLowerCase()),
  );

  return (
    <DashboardLayout>
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
          Search Students
        </p>

        <input
          type="text"
          placeholder="Search by name, scholar ID or branch..."
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
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[2rem]
          p-6
          transition-all
          hover:shadow-sm
        "
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2
                    className="
                text-[1.55rem]
                font-black
                text-[#231F1B]
                leading-tight
              "
                  >
                    {student.name}
                  </h2>

                  <p
                    className="
                text-[#746B60]
                mt-1
              "
                  >
                    {student.email}
                  </p>
                </div>

                <span
                  className={`px-5 py-2 rounded-full text-sm font-medium ${
                    student.isPlaced
                      ? "bg-green-100 text-green-700"
                      : "bg-[#EFE7DA] text-[#746B60]"
                  }`}
                >
                  {student.isPlaced ? "Placed" : "Unplaced"}
                </span>
              </div>

              {/* Student Info */}
              <div
                className="
            grid
            md:grid-cols-4
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
                    {student.scholarId || "N/A"}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-[#7A7166]">Branch</p>

                  <h3 className="font-semibold text-[#231F1B] mt-1">
                    {student.branch || "N/A"}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-[#7A7166]">CGPA</p>

                  <h3 className="font-semibold text-[#231F1B] mt-1">
                    {student.cgpa ?? "N/A"}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-[#7A7166]">Backlogs</p>

                  <h3 className="font-semibold text-[#231F1B] mt-1">
                    {student.backlogs ?? 0}
                  </h3>
                </div>
              </div>

              {/* Edit Mode */}
              {editingId === student._id ? (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <input
                    placeholder="Scholar ID"
                    value={editData.scholarId}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        scholarId: e.target.value,
                      })
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
                  />

                  <input
                    placeholder="Branch"
                    value={editData.branch}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        branch: e.target.value,
                      })
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
                  />

                  <select
                    value={editData.isPlaced ? "yes" : "no"}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        isPlaced: e.target.value === "yes",
                      })
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
                    <option value="no">Unplaced</option>

                    <option value="yes">Placed</option>
                  </select>

                  {editData.isPlaced && (
                    <div className="md:col-span-2 space-y-3">
                      <input
                        type="text"
                        placeholder="Search company..."
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        className="
                    w-full
                    rounded-[1rem]
                    border
                    border-[#DDD1C3]
                    bg-[#F8F3EC]
                    px-4
                    py-3
                    outline-none
                  "
                      />

                      {companySearch &&
                        filteredCompanies.length > 0 &&
                        companySearch !== editData.placedCompany && (
                          <div
                            className="
                        border
                        border-[#DDD1C3]
                        rounded-[1.2rem]
                        bg-[#FBF7F1]
                        max-h-48
                        overflow-y-auto
                      "
                          >
                            {filteredCompanies.map((company) => (
                              <button
                                key={company._id}
                                onClick={() => handleCompanySelect(company)}
                                className="
                              w-full
                              text-left
                              px-4
                              py-4
                              hover:bg-[#F4ECE2]
                              transition-all
                            "
                              >
                                <p className="font-semibold text-[#231F1B]">
                                  {company.companyName}
                                </p>

                                <p className="text-sm text-[#746B60]">
                                  {company.role}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          value={editData.placedRole}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              placedRole: e.target.value,
                            })
                          }
                          placeholder="Role"
                          className="
                      rounded-[1rem]
                      border
                      border-[#DDD1C3]
                      bg-[#F8F3EC]
                      px-4
                      py-3
                    "
                        />

                        <input
                          value={editData.placedCTC}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              placedCTC: e.target.value,
                            })
                          }
                          placeholder="CTC"
                          className="
                      rounded-[1rem]
                      border
                      border-[#DDD1C3]
                      bg-[#F8F3EC]
                      px-4
                      py-3
                    "
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleSave(student._id)}
                    className="
                bg-[#231F1B]
                text-white
                rounded-[1rem]
                py-3
                font-medium
                hover:opacity-90
                transition-all
              "
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(student)}
                  className="
              mt-6
              bg-[#231F1B]
              text-white
              px-6
              py-3
              rounded-[1rem]
              font-medium
              hover:opacity-90
              transition-all
            "
                >
                  Edit Student
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStudentsPage;
