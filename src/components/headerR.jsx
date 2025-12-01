// Importa el componente NavLink para manejar rutas (enlaces) con React Router
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";

// Definición de las pestañas o enlaces del navbar
const tabs = [
  { to: "/", label: "Volver a Inicio", end: true },
];

export default function Navbar() {
  // Clases base y estilos para los botones del navbar
  const base =
    "px-3 py-1 rounded-md text-sm transition border font-medium no-underline";
  const active =
    "bg-gray-200 border-gray-300 text-gray-800 shadow-inner"; 
  const inactive =
    "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"; 

  return (
    // Header fijo en la parte superior
    <header className="w-screen bg-white border-b sticky top-0 z-50">
      <div className="w-full h-16 flex items-center px-8">
        <div className="flex items-center gap-3">
          <img src= "/src/assets/logo.jpg"/>
          <span className="font-bold text-xl text-gray-800"></span>
        </div>

        <nav className="ml-auto flex items-center gap-4">
          {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>`${base} ${isActive ? active : inactive} !text-gray-700 hover:!text-gray-900`}
            >
            {t.label}
          </NavLink>))}
        </nav>
      </div>
    </header>
  );
}
