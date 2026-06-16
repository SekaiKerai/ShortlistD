import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B645B] text-lg">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force profile completion for students
  const incompleteProfile =
    user.role === "student" &&
    (!user.scholarId || !user.branch || !user.graduationYear);

  if (incompleteProfile && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  // Wrong role
  if (user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
