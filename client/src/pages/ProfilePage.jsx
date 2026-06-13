import DashboardLayout from "@/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="bg-white p-6 rounded-2xl border">
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Scholar ID:</strong> {user.scholarId}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
