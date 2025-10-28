import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";

const tabs = [
  { to: "/", label: "Inicio", end: true },
  { to: "/evaluadores", label: "Evaluadores" },
  { to: "/resultados", label: "Resultados" },
  { to: "/medallero", label: "Medallero" },
  { to: "/login", label: "Iniciar Sesion" },
];

export default function Navbar() {
  const base = "px-3 py-1 rounded-md text-sm transition border";
  const active = "bg-gray-200 border-gray-300 text-gray-900 shadow-inner";
  const inactive = "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <header className="w-screen bg-white border-b sticky top-0 z-50">
      <div className="w-full h-16 flex items-center px-8">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.jpg" />
          <span className="font-bold text-xl text-gray-800"></span>
        </div>

        <nav className="ml-auto flex items-center gap-4">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
