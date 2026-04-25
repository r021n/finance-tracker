import { useAuth } from "../contexts/useAuth";
import { LogOut, User } from "lucide-react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Finance Tracker</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
                {user?.role === "admin" && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="secondary" onClick={handleLogOut}>
                <LogOut className="h-4 w-4" />
                LogOut
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">
            Your dashboard is ready. Transaction features will be added in the
            next chapter
          </p>
        </div>
      </main>
    </div>
  );
}
