import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { UserType } from "../types/types";

interface ProtectedRouteProps {
  allowedRoles?: UserType[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
