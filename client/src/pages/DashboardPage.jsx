import DashboardLayout from "@/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "CGPA",
      value: user.cgpa ?? "N/A",
    },
    {
      title: "Backlogs",
      value: user.backlogs ?? "0",
    },
    {
      title: "Scholar ID",
      value: user.scholarId ?? "N/A",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold">Welcome back, {user.name}</h1>

          <p className="text-slate-300 mt-3 text-lg">
            Stay updated with placement opportunities and application progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="rounded-2xl border border-slate-200 shadow-sm"
            >
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">{stat.title}</p>

                <h2 className="text-3xl font-bold mt-2 text-slate-900">
                  {stat.value}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-7">
            <h2 className="text-xl font-semibold mb-5">Student Profile</h2>

            <div className="grid md:grid-cols-2 gap-4 text-slate-700">
              <div>
                <span className="text-slate-500">Email</span>

                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <span className="text-slate-500">Role</span>

                <p className="font-medium capitalize">{user.role}</p>
              </div>

              <div>
                <span className="text-slate-500">Scholar ID</span>

                <p className="font-medium">{user.scholarId}</p>
              </div>

              <div>
                <span className="text-slate-500">CGPA</span>

                <p className="font-medium">{user.cgpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
