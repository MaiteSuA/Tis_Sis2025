// components/Navbar.jsx
import { useState } from "react";
import logo from "../assets/logo.jpg";

import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import VerifyCodeModal from "./VerifyCodeModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function Navbar() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // guardamos el correo que se está recuperando
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");

  const base =
    "px-3 py-1 rounded-md text-sm transition border font-medium no-underline";
  const inactive =
    "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100";

  // --- Navegación entre modales ---

  // Abrir registro desde login
  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // Abrir login desde registro
  const handleOpenLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  // Abrir recuperar contraseña desde login
  const handleOpenForgot = () => {
    console.log("🔄 Abriendo recuperar contraseña desde Navbar");
    setShowLogin(false);
    setShowForgot(true);
  };

  return (
    <>
      <header className="w-screen bg-white border-b sticky top-0 z-40">
        <div className="w-full h-16 flex items-center px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="OhSanSi" className="h-10 w-auto" />
          </div>

          <nav className="ml-auto flex items-center gap-4">
            {/* Si quieres habilitar registro público, descomenta esto */}
            {/*
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className={`${base} ${inactive}`}
            >
              Registrarse
            </button>
            */}

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

      {/* MODAL: Registro */}
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={handleOpenLogin}
      />

      {/* MODAL: Login (con onOpenForgot) */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onOpenRegister={handleOpenRegister}
        onOpenForgot={handleOpenForgot}
      />

      {/* MODAL 1: Forgot password (ingresa correo) */}
      <ForgotPasswordModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
        onSuccess={(email) => {
          console.log("✅ Email para recuperación:", email);
          // guardamos el correo y pasamos al siguiente paso
          setCorreoRecuperacion(email);
          setShowForgot(false);
          setShowVerify(true);
        }}
      />

      {/* MODAL 2: Verificar código de 6 dígitos */}
      <VerifyCodeModal
        open={showVerify}
        correo={correoRecuperacion}
        onClose={() => setShowVerify(false)}
        onVerified={() => {
          // código correcto → pasamos al reset
          setShowVerify(false);
          setShowReset(true);
        }}
      />

      {/* MODAL 3: Resetear contraseña */}
      <ResetPasswordModal
        open={showReset}
        correo={correoRecuperacion}
        onClose={() => setShowReset(false)}
        onSuccess={() => {
          // contraseña cambiada → cerrar reset y abrir login
          setShowReset(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
