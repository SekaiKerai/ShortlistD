import DashboardLayout from "@/layout/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        <p className="text-slate-500 mt-2">Welcome to ShortlistD</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
