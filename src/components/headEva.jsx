// Importa el componente NavLink para manejar rutas (enlaces) con React Router
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEstadoProceso } from "../hook/useEstadoProceso";
import { useNavigate } from "react-router-dom";
// Definición de las pestañas o enlaces del navbar
const tabs = [
  { to: "/", label: "Cerrar Sesion", end: true },
];

export default function Navbar() {
  const navigate = useNavigate();

  // 👇 Leemos la fase que definió el ADMIN (clasificatoria, final, concluido)
  const { label } = useEstadoProceso(); // ej. "Fase clasificatoria"

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
        {/* IZQUIERDA: logo + info rol/fase */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="OhSanSi"
            className="h-10 w-auto rounded-md object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg text-gray-800">
              EVALUADOR
            </span>
            <span className="text-xs text-gray-500">
               · {label}
            </span>
          </div>
        </div>

        {/* DERECHA: botón cerrar sesión */}
        <button
          onClick={handleLogout}
          className="ml-auto px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
