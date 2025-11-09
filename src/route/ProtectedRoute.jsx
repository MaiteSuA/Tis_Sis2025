import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allow = [] }) {
  // Simula autenticación (reemplaza con tu lógica real)
  const userRole = null; // e.g., "ADMIN" si está logueado

  if (!userRole) return <Navigate to="/forbidden" replace />;
  if (allow.length && !allow.includes(userRole)) return <Navigate to="/forbidden" replace />;

  return <Outlet />;
}
