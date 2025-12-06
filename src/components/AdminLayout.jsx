// Importa NavLink y useNavigate de react-router-dom.
import { NavLink, useNavigate } from "react-router-dom";

// Importa el archivo de imagen del logo desde la carpeta de assets.
import logo from "../assets/logo-ohsansi.png";
import { useEstadoProceso } from "../hook/useEstadoProceso";
// Componente principal del layout (diseño base) para la sección de administración.
// Recibe como prop "children", que representa el contenido que se mostrará dentro del layout.
export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirige al inicio / login
  };

  //  Lee la fase actual desde el backend / localStorage
  const { label, fase } = useEstadoProceso();

  // Colores según la fase
  let faseClass =
    "px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700";
  if (fase === "CLASIFICATORIA")
    faseClass =
      "px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800";
  if (fase === "FINAL")
    faseClass =
      "px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800";
  if (fase === "CONCLUIDO")
    faseClass =
      "px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER fijo */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden shrink-0">
              <img
                src={logo}
                alt="Logo OhSanSi"
                className="object-contain"
                style={{
                  width: "150px",
                  height: "150px",
                  maxWidth: "150px",
                  maxHeight: "150px",
                }}
              />
            </div>
          </div>

          {/*  Fase actual del proceso (centro) */}
          <div className="flex-1 flex justify-center">
            <span className="text-sm text-gray-600 italic">
              • {label}</span>
          </div>

          {/* NAV derecha */}
          <nav
            role="navigation"
            aria-label="Secciones"
            className="rounded-full border border-gray-300 bg-white px-3 py-1 shadow-sm inline-flex items-center gap-2"
          >
            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 bg-white"
            >
              Cerrar sesión
            </button>

            {/* Ir a inicio admin */}
            <NavLink
              to="/admin/usuarios"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                  isActive ? "bg-gray-200" : "bg-white"
                }`
              }
            >
              Inicio
            </NavLink>

            {/* Log (si luego lo usas) */}
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
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-0">
        {children}
      </main>

      {/* Riel decorativo derecho */}
      <div
        aria-hidden
        className="fixed right-0 inset-y-0 w-4 bg-black z-10 pointer-events-none"
      />
    </div>
  );
}