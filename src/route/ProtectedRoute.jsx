import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allow = [] }) {
  // Ejemplo: lee usuario desde localStorage (ajústalo a tu auth)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || null;

  // Si no hay sesión → al login (mejor UX que forbidden)
  if (!role) return <Navigate to="/login" replace />;

  // Si hay sesión pero rol no permitido → forbidden
  if (allow.length && !allow.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
