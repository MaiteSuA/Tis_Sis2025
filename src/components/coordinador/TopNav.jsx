import Brand from "../Brand";
import { NavLink, useNavigate } from "react-router-dom";
import { useEstadoProceso } from "../../hook/useEstadoProceso";
import { useEffect, useState } from "react";

export default function TopNav() {
  const navigate = useNavigate();
  const { label } = useEstadoProceso();

  const [coordinador, setCoordinador] = useState({
    nombre: "",
    apellido: "",
  });

  // Obtener nombre/apellido desde el token almacenado
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));

      setCoordinador({
        nombre: payload.nombre || payload.name || "",
        apellido: payload.apellidos || payload.lastname || "",
      });
    } catch (e) {
      console.error("Error leyendo token:", e);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  const tabBase =
    "px-3 py-1.5 text-sm rounded-lg transition font-medium no-underline";
  const tabActive = "bg-gray-900 text-white shadow";
  const tabInactive = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* LOGO */}
        <Brand />

        {/* Texto del Coordinador logueado */}
        <span className="text-gray-700 font-semibold text-sm tracking-wide">
          {coordinador.nombre} {coordinador.apellido} · COORDINADOR · {label}
        </span>

        {/* --- BOTONES DEL COORDINADOR --- */}
        <nav className="hidden md:flex items-center gap-2">

          {/* Gestionar Inscritos */}
          <NavLink
            to="/coordinador/gestionar-inscritos"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Gestionar inscritos
          </NavLink>

          {/* Registro Responsables */}
          <NavLink
            to="/coordinador/registro-responsables"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Registro de Responsables
          </NavLink>

          {/* Importar Inscritos */}
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

          <button
            className="btn text-sm px-3 py-1.5"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>

          <button className="btn text-sm px-3 py-1.5" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
