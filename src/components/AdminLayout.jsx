// Importa NavLink para navegación interna y el logo de la aplicación
import { NavLink } from "react-router-dom";
import logo from "../assets/logo-ohsansi.png";

// Componente principal del layout del panel de administración
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER fijo */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo + nombre */}
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden shrink-0">
              <img
                src={logo}
                alt="Logo OhSanSi"
                className="object-contain"
                style={{
                  width: "224px",
                  height: "224px",
                  maxWidth: "224px",
                  maxHeight: "224px",
                }}
              />
            </div>
            <span className="font-semibold text-gray-800 text-lg">OhSanSi</span>
          </div>

          {/* Barra de navegación superior (links del panel) */}
          <nav
            role="navigation"
            aria-label="Secciones"
            className="rounded-full border border-gray-300 bg-white px-2 py-1 shadow-sm inline-flex items-center gap-1"
          >
            {/* Botón: Ir al inicio */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                  isActive ? "bg-gray-200" : "bg-white"
                }`
              }
            >
              Inicio
            </NavLink>

            {/* Botón: Dashboard principal del administrador */}
            <NavLink
              to="/admin/usuarios"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                  isActive ? "bg-gray-200" : "bg-white"
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* Botón: Log de actividades */}
            <NavLink
              to="/admin/log"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                  isActive ? "bg-gray-200" : "bg-white"
                }`
              }
            >
              Log
            </NavLink>
          </nav>
        </div>
      </header>

      {/* CONTENIDO principal*/}
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-0">{children}</main>

      {/* Riel derecho */}
      <div
        aria-hidden
        className="fixed right-0 inset-y-0 w-4 bg-black z-10 pointer-events-none"
      />
    </div>
  );
}

