import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
