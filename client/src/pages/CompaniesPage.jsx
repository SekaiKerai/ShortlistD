import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import CompanyCard from "@/components/dashboard/CompanyCard";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [offerType, setOfferType] = useState("all");

  const [eligibleOnly, setEligibleOnly] = useState(false);

  const [minCTC, setMinCTC] = useState("");

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

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.companyName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesOffer =
        offerType === "all" || company.offerType === offerType;

      const matchesEligibility = !eligibleOnly || company.isEligible;

      const companyCTC =
        Number(String(company.package).replace(/[^0-9.]/g, "")) || 0;

      const matchesCTC = minCTC === "" || companyCTC >= Number(minCTC);
      return matchesSearch && matchesOffer && matchesEligibility && matchesCTC;
    });
  }, [companies, search, offerType, eligibleOnly, minCTC]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>

          <p className="text-slate-500 mt-1">Available placement drives</p>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-2xl p-5 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3 flex-1"
          />

          {/* Offer Type */}
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="all">All Offers</option>

            <option value="fte">FTE</option>

            <option value="6m+ppo">6M + PPO</option>

            <option value="6m+fte">6M + FTE</option>
          </select>

          {/* Min LPA */}
          <input
            type="number"
            placeholder="Min LPA"
            value={minCTC}
            onChange={(e) => setMinCTC(e.target.value)}
            className="border rounded-xl px-4 py-3 w-full lg:w-40"
          />

          {/* Eligible Toggle */}
          <label className="flex items-center gap-2 px-2">
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={() => setEligibleOnly(!eligibleOnly)}
            />
            Eligible Only
          </label>
        </div>

        {/* Companies */}
        {loading ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            Loading companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
            No companies found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompaniesPage;
