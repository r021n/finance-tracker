import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
