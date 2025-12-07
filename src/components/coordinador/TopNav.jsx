// src/components/coordinador/TopNav.jsx
import Brand from "../Brand";
import { NavLink, useNavigate } from "react-router-dom";
import { useEstadoProceso } from "../../hook/useEstadoProceso";
import { useEffect, useState } from "react";

export default function TopNav() {
  const navigate = useNavigate();
  const { label } = useEstadoProceso(); // p.ej. "Fase final"

  const [coordinador, setCoordinador] = useState({
    nombre: "",
    apellido: "",
  });

  // 🔹 Cargar datos del coordinador desde localStorage
  useEffect(() => {
    try {
      // 1) Intentar con "usuario" (lo que guarda tu loginApi)
      const rawUser = localStorage.getItem("usuario");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        setCoordinador({
          nombre: u.nombre || u.nombres || "",
          apellido: u.apellidos || u.apellido || "",
        });
        return;
      }

      // 2) Fallback: intentar decodificar el token, por si acaso
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        setCoordinador({
          nombre: payload.nombre || payload.name || "",
          apellido: payload.apellidos || payload.lastname || "",
        });
      }
    } catch (e) {
      console.error("Error leyendo datos de coordinador:", e);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  }

  const tabBase =
    "px-3 py-1.5 text-sm rounded-lg transition font-medium no-underline";
  const tabActive = "bg-gray-900 text-white shadow";
  const tabInactive = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const nombreCompleto =
    (coordinador.nombre || coordinador.apellido)
      ? `${coordinador.nombre} ${coordinador.apellido}`.trim()
      : "COORDINADOR";

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* LOGO */}
        <Brand />

        {/* Texto central: nombre + rol + fase */}
        <span className="text-gray-700 font-semibold text-sm tracking-wide">
          {nombreCompleto} · COORDINADOR · {label}
        </span>

        {/* Navegación principal */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/coordinador/gestionar-inscritos"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Gestionar inscritos
          </NavLink>

          <NavLink
            to="/coordinador/registro-responsables"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Registro de Responsables
          </NavLink>

          <NavLink
            to="/coordinador/importar-inscritos"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Importar Inscritos
          </NavLink>
        </nav>

        {/* Botones derecha */}
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
