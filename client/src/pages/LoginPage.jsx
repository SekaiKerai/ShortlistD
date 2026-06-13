import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { fetchCurrentUser } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      await fetchCurrentUser();

      alert("Login successful");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>ShortlistD</h1>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert("Google login failed")}
      />
    </div>
  );
};

export default LoginPage;
