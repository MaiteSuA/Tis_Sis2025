import React from "react";
import logo from "../assets/ohSansi-Logo.png"; // Ajusta la ruta a tu logo
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-300 text-black p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <img src={logo} alt="Oh Sansi Logo" className="h-18" />

        {/* Navegación */}
        <nav
          role="navigation"
          aria-label="Secciones"
          className="rounded-full border border-gray-300 bg-white px-2 py-1 shadow-sm inline-flex items-center gap-1"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                isActive ? "bg-gray-200" : "bg-white"
              }`              }
          >
            Cerrar Sesion
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header