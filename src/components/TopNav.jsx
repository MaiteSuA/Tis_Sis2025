import Brand from "./Brand";
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate(); // inicializamos la función de navegación

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Brand />

        {/* Menú principal */}
         <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white"
          >
            Inicio
          </button>
        </nav>

        {/* Botones verticales alineados al centro */}
        <div className="flex flex-col justify-center items-end gap-1 h-20">
          <button className="btn text-sm px-3 py-1.5">
            Perfil Coordinador
          </button>
          <button
            className="btn text-sm px-3 py-1.5"
            onClick={() => navigate("/login")}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
