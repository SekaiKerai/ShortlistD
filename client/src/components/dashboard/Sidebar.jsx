import {
  LayoutDashboard,
  Building2,
  FileText,
  User,
  PlusSquare,
  Users,
  Briefcase,
  Bell,
  BarChart3,
  ChevronRight,
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
      path: "/admin",
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
      name: "Announcements",
      icon: Bell,
      path: "/admin/announcements",
    },
    {
      name: "Students",
      icon: Users,
      path: "/admin/students",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : studentMenuItems;

  return (
    <aside
      className="
      w-72
      h-screen
      sticky
      top-0
      shrink-0
      bg-[#F4EFE7]
      border-r
      border-[#DED6C8]
      flex
      flex-col
      px-5
      py-6
      shadow-sm
      overflow-y-auto
    "
    >
      {/* Branding */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div
            className="
            w-14 h-14
            rounded-[1.3rem]
            bg-[#23211D]
            flex items-center justify-center
            shadow-md
          "
          >
            <Briefcase className="text-[#F4EFE7]" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#23211D] tracking-tight">
              ShortlistD
            </h1>

            <p className="text-sm text-[#746C61]">Placement Portal</p>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-8">
        <div
          className="
          rounded-[1.5rem]
          border
          border-[#D7CEBF]
          bg-[#FBF8F3]
          p-4
        "
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#9C8B74] font-semibold">
            Logged In As
          </p>

          <h3 className="mt-2 font-bold text-[#23211D] text-lg capitalize">
            {user?.role}
          </h3>

          <p className="text-sm text-[#726A5E] mt-1 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `
                group
                flex
                items-center
                justify-between
                px-5
                py-4
                rounded-[1.4rem]
                transition-all
                duration-300
                ${
                  isActive
                    ? `
                    bg-[#23211D]
                    text-[#F4EFE7]
                    shadow-lg
                    scale-[1.02]
                  `
                    : `
                    text-[#534B41]
                    hover:bg-[#ECE3D5]
                    hover:translate-x-1
                  `
                }
              `
              }
            >
              <div className="flex items-center gap-4">
                <Icon size={21} />

                <span className="font-medium">{item.name}</span>
              </div>

              <ChevronRight size={18} className="opacity-50" />
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="
        mt-6
        rounded-[1.8rem]
        bg-[#E9E1D4]
        border
        border-[#D7CEBF]
        p-5
      "
      >
        <p className="text-sm text-[#7A7267]">
          Keep checking regularly for placement updates.
        </p>

        <div className="mt-3 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D08A5A] animate-pulse" />

          <span className="text-sm font-medium text-[#23211D]">
            Opportunities active
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
