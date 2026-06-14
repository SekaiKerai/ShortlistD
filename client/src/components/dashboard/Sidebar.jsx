import {
  LayoutDashboard,
  Building2,
  FileText,
  User,
  PlusSquare,
  Users,
  Briefcase,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const studentMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Companies",
      icon: Building2,
      path: "/companies",
    },
    {
      name: "Applications",
      icon: FileText,
      path: "/applications",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Create Company",
      icon: PlusSquare,
      path: "/admin/create-company",
    },
    {
      name: "Manage Companies",
      icon: Briefcase,
      path: "/admin/companies",
    },
    {
      name: "Applicants",
      icon: FileText,
      path: "/admin/applicants",
    },
    {
      name: "Students",
      icon: Users,
      path: "/admin/students",
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : studentMenuItems;

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col px-5 py-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          ShortlistD
        </h1>

        <p className="text-sm text-slate-500 mt-1">Placement Portal</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
