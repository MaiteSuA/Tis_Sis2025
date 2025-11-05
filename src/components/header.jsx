import React from "react";
import logo from "../assets/ohSansi-Logo.png"; // Ajusta la ruta a tu logo

const Header = () => {
  return (
    <header className="bg-gray-300 text-black p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <img src={logo} alt="Oh Sansi Logo" className="h-18" />

        {/* Navegación */}
        <nav className="flex gap-4 text-sm">
          <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200">Inicio</button>
          <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200">Mis Evaluaciones</button>
          <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200">Cerrar Sesión</button>
        </nav>
      </div>
    </header>
  );
};

export default Header