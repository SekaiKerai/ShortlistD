import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      console.log(response.data);
      alert("Login successful");
    } catch (error) {
      console.error(error.response?.data);
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
