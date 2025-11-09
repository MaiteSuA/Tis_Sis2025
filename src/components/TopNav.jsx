import Brand from "./Brand";
// 🆕 Importamos el hook de navegación
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate(); // 🆕 inicializamos la función de navegación

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Brand />

        {/* Menú principal */}
        <nav className="hidden md:flex items-center gap-2">
          {["Inicio", "Dashboard", "Inscritos", "Listas"].map((x, i) => (
            <button
              key={x}
              // 🆕 Si el botón es “Inicio”, lo hacemos navegar al Home
              onClick={() => {
                if (x === "Inicio") navigate("/");
                // puedes añadir más navegaciones si quieres:
                else if (x === "Dashboard") navigate("/importar");
                else if (x === "Inscritos") navigate("/evaluadores");
                else if (x === "Listas") navigate("/medallero");
              }}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                i === 0
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100 transition"
              }`}
            >
              {x}
            </button>
          ))}
        </nav>

        {/* Botones verticales alineados al centro */}
        <div className="flex flex-col justify-center items-end gap-1 h-20">
          <button className="btn text-sm px-3 py-1.5">Perfil Coordinador</button>
          <button className="btn text-sm px-3 py-1.5">Cerrar Sesión</button>
        </div>
      </div>
    </header>
  );
}
