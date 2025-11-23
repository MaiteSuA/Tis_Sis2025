import Brand from "../Brand";
import { NavLink, useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  const tabBase =
    "px-3 py-1.5 text-sm rounded-lg transition font-medium no-underline";
  const tabActive = "bg-gray-900 text-white shadow";
  const tabInactive =
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">

        {/* LOGO */}
        <Brand />

        {/* --- BOTONES DEL COORDINADOR --- */}
        <nav className="hidden md:flex items-center gap-2">

          {/* PERFIL */}
          <NavLink
            to="/coordinador/perfil"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Perfil Coordinador
          </NavLink>

          {/* "Registro de Responsables */}
          <NavLink
            to="/coordinador/registro-responsables"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Registro de Responsables
          </NavLink>

          {/* IMPORTAR INSCRITOS */}
          <NavLink
            to="/coordinador/importar-inscritos"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Importar Inscritos
          </NavLink>
        </nav>

        {/* --- BOTONES DERECHA (INICIO / CERRAR SESIÓN) --- */}
        <div className="flex flex-col items-end gap-1 h-20">

          {/* INICIO */}
          <button
            className="btn text-sm px-3 py-1.5"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>

          {/* CERRAR SESIÓN */}
          <button
            className="btn text-sm px-3 py-1.5"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </header>
  );
}
