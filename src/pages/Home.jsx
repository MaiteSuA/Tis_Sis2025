// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import VerifyCodeModal from "../components/VerifyCodeModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import { getAnunciosVigentes } from "../api/anuncios";

// Página de inicio

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");

  const [anuncios, setAnuncios] = useState([]);

  const navigate = useNavigate(); //  para ir a medallero / clasificados

  // Cargar anuncios vigentes para el carrusel del home
  useEffect(() => {
    async function cargar() {
      try {
        const data = await getAnunciosVigentes();
        setAnuncios(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando anuncios vigentes:", e);
      }
    }
    cargar();
  }, []);

  // Adaptar la forma de los anuncios de BD al formato que espera el Carousel
  const anunciosAdaptados = anuncios.map((a) => ({
    title: a.titulo,
    description: a.contenido,
    image: a.imagen_url,
  }));

  // Funciones para navegación entre modales
  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleOpenForgot = () => {
    setShowLogin(false);
    setShowForgot(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO esto ocupa toda la pantalla */}
      <section className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
          Sistema de <br className="hidden md:block" />
          Evaluación <br className="hidden md:block" />
          "Olimpiadas OhSansi"
        </h1>

        {/* Carrusel centrado debajo del título */}
        <div className="w-full max-w-5xl mb-8">
          {/* 👇 AHORA SOLO USA ANUNCIOS DE BD */}
          <Carousel items={anunciosAdaptados} />
        </div>

        {/* Botones Medallero / Clasificados */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/medallero")}
            className="px-8 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-white font-semibold shadow-md transition opacity-100 relative z-10"
          >
            Medallero
          </button>

          <button
            onClick={() => navigate("/clasificados")}
            className="px-8 py-2 rounded-md border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white font-semibold shadow-md transition opacity-100 relative z-10"
          >
            Clasificados
          </button>
        </div>
      </section>

      <footer className="w-screen bg-gray-100 py-6 text-center text-sm text-gray-500">
        © 2025 OhSanSi — Todos los derechos reservados.
      </footer>

      {/* MODALES */}
      <LoginModal
        open={showLogin}
        onClose={handleCloseLogin}
        onOpenRegister={handleOpenRegister}
        onOpenForgot={handleOpenForgot}
      />

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      <ForgotPasswordModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
        onSuccess={(email) => {
          setCorreoRecuperacion(email);
          setShowForgot(false);
          setShowVerify(true);
        }}
      />

      <VerifyCodeModal
        open={showVerify}
        correo={correoRecuperacion}
        onClose={() => setShowVerify(false)}
        onVerified={() => {
          setShowVerify(false);
          setShowReset(true);
        }}
      />

      <ResetPasswordModal
        open={showReset}
        correo={correoRecuperacion}
        onClose={() => setShowReset(false)}
        onSuccess={() => {
          setShowReset(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
