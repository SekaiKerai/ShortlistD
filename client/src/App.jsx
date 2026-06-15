import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import CompaniesPage from "./pages/CompaniesPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import CreateCompanyPage from "./pages/CreateCompanyPage";
import ManageCompaniesPage from "./pages/ManageCompaniesPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

import EligibleStudentsPage from "./pages/EligibleStudentsPage";

import AdminAnnouncementsPage from "./pages/AdminAnnouncementsPage";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* STUDENT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "student" && !user?.scholarId ? (
                <Navigate to="/complete-profile" />
              ) : (
                <DashboardPage />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute role="admin">
              <AdminDashboardPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/create-company"
          element={
            <RoleProtectedRoute role="admin">
              <CreateCompanyPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <RoleProtectedRoute role="admin">
              <ManageCompaniesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <RoleProtectedRoute role="admin">
              <AdminAnnouncementsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/company/:companyId/applicants"
          element={
            <RoleProtectedRoute role="admin">
              <ApplicantsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/company/:companyId/eligible"
          element={
            <RoleProtectedRoute role="admin">
              <EligibleStudentsPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <RoleProtectedRoute role="admin">
              <AdminStudentsPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute role="admin">
              <AdminAnalyticsPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                  : "/login"
              }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
