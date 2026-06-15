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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>

          <p className="text-slate-500 mt-1">
            Manage student profiles & placements
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, scholar ID or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-2xl p-4"
        />

        {loading ? (
          <div className="bg-white border rounded-3xl p-10 text-center">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-white border rounded-3xl p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{student.name}</h2>

                    <p className="text-slate-500">{student.email}</p>
                  </div>

                  <span className="bg-slate-100 px-4 py-2 rounded-full text-sm">
                    {student.isPlaced ? "Placed" : "Unplaced"}
                  </span>
                </div>

                {editingId === student._id ? (
                  <div className="grid md:grid-cols-2 gap-4 mt-5">
                    <input
                      placeholder="Scholar ID"
                      value={editData.scholarId}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          scholarId: e.target.value,
                        })
                      }
                      className="border rounded-xl p-3"
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
                      className="border rounded-xl p-3"
                    />

                    <select
                      value={editData.isPlaced ? "yes" : "no"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isPlaced: e.target.value === "yes",
                        })
                      }
                      className="border rounded-xl p-3"
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
                          className="border rounded-xl p-3 w-full"
                        />

                        {companySearch && filteredCompanies.length > 0 && (
                          <div className="border rounded-xl bg-white max-h-40 overflow-y-auto">
                            {filteredCompanies.map((company) => (
                              <button
                                key={company._id}
                                onClick={() => handleCompanySelect(company)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                              >
                                {company.companyName} — {company.role}
                              </button>
                            ))}
                          </div>
                        )}

                        <input
                          value={editData.placedRole}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              placedRole: e.target.value,
                            })
                          }
                          placeholder="Role"
                          className="border rounded-xl p-3 w-full"
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
                          className="border rounded-xl p-3 w-full"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => handleSave(student._id)}
                      className="bg-green-600 text-white rounded-xl py-3"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(student)}
                    className="mt-5 bg-slate-900 text-white px-6 py-3 rounded-xl"
                  >
                    Edit Student
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsPage;
