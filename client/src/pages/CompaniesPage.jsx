import axios from "axios";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";

import CompanyCard from "@/components/dashboard/CompanyCard";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/company`,
          {
            withCredentials: true,
          },
        );

        setCompanies(res.data.companies);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>

          <p className="text-slate-500 mt-1">Available placement drives</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompaniesPage;
