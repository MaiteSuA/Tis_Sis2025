// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allow = [] }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  // Aceptar tanto "role" como "rol"
  const role = user?.role || user?.rol || null;

  console.log("🔐 ProtectedRoute user:", user);
  console.log("🔐 role:", role, "allow:", allow);

  // Sin sesión → login
  if (!role) return <Navigate to="/login" replace />;

  // Rol no permitido → forbidden
  if (allow.length && !allow.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
