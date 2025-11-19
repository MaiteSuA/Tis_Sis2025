// components/Navbar.jsx
import { useState } from "react";
import logo from "../assets/logo.jpg";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const base = "px-3 py-1 rounded-md text-sm transition border font-medium no-underline";
  const inactive = "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100";

  // Función para abrir registro desde login
  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // Función para abrir login desde registro
  const handleOpenLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <header className="w-screen bg-white border-b sticky top-0 z-40">
        <div className="w-full h-16 flex items-center px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="OhSanSi" className="h-10 w-auto" />
          </div>

          <nav className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className={`${base} ${inactive}`}
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className={`${base} ${inactive} !text-gray-700 hover:!text-gray-900`}
            >
              Iniciar Sesión
            </button>
          </nav>
        </div>
      </header>

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={handleOpenLogin}  // Nueva prop
      />

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onOpenRegister={handleOpenRegister}  // Nueva prop
      />
    </>
  );
}