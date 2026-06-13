import { Card, CardContent } from "@/components/ui/card";

const CompanyCard = ({ company }) => {
  const deadline = new Date(company.applicationDeadline);

  const now = new Date();

  const timeLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{company.companyName}</h2>

          <p className="text-slate-500">{company.role}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Package</p>

            <p className="font-medium">{company.package} LPA</p>
          </div>

          <div>
            <p className="text-slate-500">CGPA</p>

            <p className="font-medium">{company.minimumCGPA}</p>
          </div>

          <div>
            <p className="text-slate-500">Backlogs</p>

            <p className="font-medium">{company.allowedBacklogs}</p>
          </div>

          <div>
            <p className="text-slate-500">Deadline</p>

            <p className="font-medium">
              {timeLeft > 0 ? `${timeLeft} days left` : "Closed"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-slate-500 text-sm mb-1">Eligible Branches</p>

          <div className="flex flex-wrap gap-2">
            {company.eligibleBranches.map((branch) => (
              <span
                key={branch}
                className="px-3 py-1 rounded-full bg-slate-100 text-sm"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {company.whatsappGroupLink && (
            <a
              href={company.whatsappGroupLink}
              target="_blank"
              className="text-sm font-medium text-blue-600"
            >
              Join Group
            </a>
          )}

          {company.jobDescriptionLink && (
            <a
              href={company.jobDescriptionLink}
              target="_blank"
              className="text-sm font-medium text-slate-800"
            >
              View JD
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
