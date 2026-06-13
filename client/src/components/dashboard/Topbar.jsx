import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      setUser(null);

      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>

        <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer h-11 w-11 border">
            <AvatarImage src={user?.profilePicture} />

            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>{user.email}</DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
