import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearSession } from "../servicios/auth";
import { ROLES } from "../roles/roles";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser(); // {id, name, role, email}

  // Define las rutas visibles por cada rol
  const linksPorRol = {
    [ROLES.ADMIN]: [
      { to: "/admin/users", label: "Gestión de usuarios" },
      { to: "/reportes", label: "Reportes" },
    ],
    [ROLES.COORD]: [
      { to: "/coordinador/competencias", label: "Gestión de competencias" },
    ],
    [ROLES.RESP_AREA]: [
      { to: "/responsable/evaluadores", label: "Evaluadores" },
      { to: "/responsable/resultados", label: "Resultados" },
    ],
    [ROLES.EVALUADOR]: [
      { to: "/evaluador/evaluaciones", label: "Evaluaciones asignadas" },
    ],
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const links = user ? linksPorRol[user.role] || [] : [];

  return (
    <nav className="w-full bg-gray-800 text-white flex items-center justify-between px-6 py-3 shadow">
      {/* Logo o título */}
      <Link to="/" className="text-lg font-semibold tracking-wide">
        Oh! SanSi
      </Link>

      {/* Enlaces según el rol */}
      <ul className="flex gap-5 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="hover:text-gray-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Usuario + Logout */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 text-sm rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
}

