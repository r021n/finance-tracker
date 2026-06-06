import { useNavigate } from "react-router";
import { Home, AlertTriangle } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center size-24 bg-yellow-100 rounded-full mx-auto mb-6">
          <AlertTriangle className="size-12 text-yellow-600" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been removed.
        </p>

        <Button onClick={() => navigate("/dashboard", { replace: true })}>
          <Home className="size-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
