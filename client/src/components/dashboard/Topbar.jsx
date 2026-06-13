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
    <header className="h-16 border-b bg-white px-6 flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.profilePicture} />

            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem>{user?.name}</DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
