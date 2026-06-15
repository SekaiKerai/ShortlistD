import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import CompanyCard from "@/components/dashboard/CompanyCard";

import { Search, SlidersHorizontal, BriefcaseBusiness } from "lucide-react";

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
      <div className="space-y-8">
        {/* Header */}
        <div
          className="
          rounded-[2rem]
          bg-[#E9DFD2]
          border
          border-[#DED2C4]
          p-8
        "
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="uppercase tracking-[0.18em] text-[#9A876F] text-sm font-semibold">
                Placement Opportunities
              </p>

              <h1 className="text-[2.5rem] font-black text-[#231F1B] mt-3">
                Explore Companies
              </h1>

              <p className="text-[#6D645A] mt-3 text-lg max-w-2xl">
                Browse available placement drives, check eligibility and apply
                before deadlines.
              </p>
            </div>

            <div
              className="
              w-16 h-16
              rounded-[1.5rem]
              bg-[#F4ECE1]
              flex
              items-center
              justify-center
            "
            >
              <BriefcaseBusiness size={30} className="text-[#B67542]" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className="
          bg-[#FBF7F1]
          border
          border-[#DED3C6]
          rounded-[2rem]
          p-6
        "
        >
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal size={20} className="text-[#A36D4B]" />

            <h2 className="font-bold text-[#231F1B] text-lg">Filters</h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#9C8F81]
              "
              />

              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full
                rounded-[1.3rem]
                border
                border-[#DDD1C3]
                bg-[#F9F4ED]
                pl-12
                pr-4
                py-4
                outline-none
                focus:ring-2
                focus:ring-[#D7B28E]
              "
              />
            </div>

            {/* Offer Type */}
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              className="
              rounded-[1.3rem]
              border
              border-[#DDD1C3]
              bg-[#F9F4ED]
              px-4
              py-4
              outline-none
            "
            >
              <option value="all">All Offers</option>

              <option value="fte">FTE</option>

              <option value="6m+ppo">6M + PPO</option>

              <option value="6m+fte">6M + FTE</option>
            </select>

            {/* Min CTC */}
            <input
              type="number"
              placeholder="Minimum LPA"
              value={minCTC}
              onChange={(e) => setMinCTC(e.target.value)}
              className="
              rounded-[1.3rem]
              border
              border-[#DDD1C3]
              bg-[#F9F4ED]
              px-4
              py-4
              outline-none
            "
            />

            {/* Eligibility */}
            <label
              className="
              flex
              items-center
              gap-3
              rounded-[1.3rem]
              border
              border-[#DDD1C3]
              bg-[#F9F4ED]
              px-5
              py-4
              cursor-pointer
            "
            >
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={() => setEligibleOnly(!eligibleOnly)}
              />

              <span className="font-medium text-[#5F574E]">Eligible Only</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {!loading && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#231F1B]">
              Available Drives
            </h2>

            <p className="text-[#756B60]">
              {filteredCompanies.length} companies found
            </p>
          </div>
        )}

        {/* Companies */}
        {loading ? (
          <div
            className="
            rounded-[2rem]
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            p-14
            text-center
            text-[#6B6258]
          "
          >
            Loading companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div
            className="
            rounded-[2rem]
            bg-[#FBF7F1]
            border
            border-[#DED3C6]
            p-14
            text-center
          "
          >
            <h3 className="text-xl font-bold text-[#231F1B]">
              No companies found
            </h3>

            <p className="text-[#746B60] mt-2">
              Try changing filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
