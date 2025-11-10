// Importa el componente NavLink de react-router-dom.
// NavLink permite crear enlaces de navegación que saben si están activos (la ruta actual coincide).
import { NavLink } from "react-router-dom";

// Importa el archivo de imagen del logo desde la carpeta de assets.
import logo from "../assets/logo-ohsansi.png";

// Componente principal del layout (diseño base) para la sección de administración.
// Recibe como prop "children", que representa el contenido que se mostrará dentro del layout.
export default function AdminLayout({ children }) {
  return (
    // Contenedor general: ocupa toda la altura de la pantalla, fondo gris claro y texto gris oscuro.
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER fijo */}
      <header className="sticky top-0 bg-white border-b z-50">
        {/* Contenedor interno centrado con márgenes y espaciado */}
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo + nombre */}
          <div className="flex items-center gap-2">
            {/* Contenedor del logo redondeado */}
            <div className="rounded-full overflow-hidden shrink-0">
              {/* Contenedor del logo redondeado */}
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
            {/* Nombre de la marca al lado del logo */}
            <span className="font-semibold text-gray-800 text-lg">OhSanSi</span>
          </div>

          {/* NAV */}
          <nav
            role="navigation"
            aria-label="Secciones"
            className="rounded-full border border-gray-300 bg-white px-2 py-1 shadow-sm inline-flex items-center gap-1"
          > 
          {/* Enlace hacia la página principal */}
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
              {/* Enlace hacia la vista de usuarios / dashboard */}
            </NavLink>

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
                {/* Enlace hacia la vista del log */}
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

      {/* CONTENIDO PRINCIPAL */}
      {/* Aquí se renderiza el contenido específico de cada página (prop children) */}
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-0">{children}</main>

       {/* Riel decorativo derecho (una franja negra fija en el borde derecho de la pantalla) */}
      <div
        aria-hidden
        className="fixed right-0 inset-y-0 w-4 bg-black z-10 pointer-events-none"
      />
    </div>
  );
}

