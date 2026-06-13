import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
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
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <div>
      <h1>Welcome {user.name}</h1>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
