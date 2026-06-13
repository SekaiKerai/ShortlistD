import { LayoutDashboard, Building2, FileText, User } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen border-r bg-white p-5">
      <h1 className="text-2xl font-bold mb-8">ShortlistD</h1>

      <nav className="flex flex-col gap-3">
        <button className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-100 transition">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-100 transition">
          <Building2 size={20} />
          Companies
        </button>

        <button className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-100 transition">
          <FileText size={20} />
          Applications
        </button>

        <button className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-100 transition">
          <User size={20} />
          Profile
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
