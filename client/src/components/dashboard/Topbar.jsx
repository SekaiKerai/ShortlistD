import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";

import { LogOut, ChevronDown } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const firstName = user?.name?.split(" ")[0];

  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };

  const hour = new Date().getHours();

  const topText =
    hour >= 5 && hour < 12
      ? "Good Morning"
      : hour >= 12 && hour < 17
        ? "Good Afternoon"
        : hour >= 17 && hour < 21
          ? "Good Evening"
          : "Working Late?";

  const subText =
    hour >= 5 && hour < 12
      ? "New opportunities might be waiting."
      : hour >= 12 && hour < 17
        ? "Keep momentum going."
        : hour >= 17 && hour < 21
          ? "Time to check today’s updates."
          : "Late nights build careers.";

  return (
    <header
      className="
      h-24
      px-8
      flex
      items-center
      justify-between
      bg-[#F7F2EA]/70
      backdrop-blur-md
      border-b
      border-[#E5DCCF]
      sticky
      top-0
      z-40
    "
    >
      {/* Left */}
      <div>
        <p
          className="
          text-sm
          uppercase
          tracking-[0.18em]
          text-[#9B8A74]
          font-semibold
        "
        >
          {topText}
        </p>

        <h2
          className="
          text-[2.2rem]
          font-black
          text-[#231F1B]
          tracking-tight
          leading-none
          mt-2
        "
        >
          {firstName}
        </h2>

        <p className="text-[#746B60] mt-3 text-[1rem]">{subText}</p>
      </div>

      {/* Right */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="
          outline-none
          rounded-[1.5rem]
        "
        >
          <div
            className="
            flex
            items-center
            gap-4
            bg-[#FBF7F1]
            border
            border-[#DDD3C6]
            rounded-[1.5rem]
            px-4
            py-3
            hover:shadow-md
            transition-all
            duration-300
          "
          >
            <Avatar className="h-12 w-12 border border-[#D8CCBD]">
              <AvatarImage src={user?.profilePicture} />

              <AvatarFallback className="bg-[#27231D] text-[#F5F1EA] font-semibold">
                {firstName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:block text-left">
              <p className="font-semibold text-[#231F1B] leading-none">
                {user?.name}
              </p>

              <p className="text-sm text-[#7A7166] mt-1 capitalize">
                {user?.role}
              </p>
            </div>

            <ChevronDown size={18} className="text-[#7A7166]" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="
          rounded-2xl
          border-[#DDD3C6]
          p-2
          w-60
        "
        >
          <div className="px-3 py-2 border-b border-slate-200 mb-1">
            <p className="font-medium text-sm">{user?.name}</p>

            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          <DropdownMenuItem
            onClick={handleLogout}
            className="
            cursor-pointer
            rounded-xl
            text-red-600
            focus:bg-red-50
            py-3
          "
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
