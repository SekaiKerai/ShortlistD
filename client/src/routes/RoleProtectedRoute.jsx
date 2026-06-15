import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // wrong role
  if (user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleProtectedRoute;
