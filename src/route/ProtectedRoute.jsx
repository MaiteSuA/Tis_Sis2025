import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, getToken } from "../servicios/auth";
import { canAccess } from "../roles/roles";
export default function ProtectedRoute({ allow=[] }) {
  const token = getToken(), user = getCurrentUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allow.length && !canAccess(user.role, allow)) return <Navigate to="/403" replace />;
  return <Outlet />;
}

