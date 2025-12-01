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
import { getAnunciosCarrusel } from "../api/anuncios";

// Fallback estático por si aún no hay anuncios en BD o la API falla
const NEWS_FALLBACK = [
  {
    title: "Convocatoria Oficial 2025 publicada",
    description: "Revisa fechas y requisitos para las Olimpiadas OhSanSi.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Capacitación a Evaluadores",
    description: "Sesiones intro y rúbricas de evaluación por áreas.",
    image:
      "https://images.unsplash.com/photo-1523580846011-8a49fd8d1a76?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Clasificatorias regionales",
    description: "Cronograma y sedes confirmadas para las pruebas.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");

  // 👇 anuncios que se mostrarán en el carrusel
  const [anuncios, setAnuncios] = useState(NEWS_FALLBACK);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  const navigate = useNavigate();

  // ----- Cargar anuncios del carrusel desde el backend -----
  useEffect(() => {
    (async () => {
      try {
        setLoadingAnuncios(true);
        const data = await getAnunciosCarrusel(); // viene del backend

        if (Array.isArray(data) && data.length > 0) {
          // Adaptamos los campos de BD al formato que espera <Carousel />
          const adaptados = data.map((a) => ({
            title: a.titulo,
            description: a.contenido,
            image: a.imagen_url, // asegúrate que en BD guardas la URL de la imagen
          }));

          setAnuncios(adaptados);
        } else {
          // si viene vacío, usamos el fallback estático
          setAnuncios(NEWS_FALLBACK);
        }
      } catch (err) {
        console.error("Error cargando anuncios del carrusel:", err);
        // en caso de error, mostramos también el fallback
        setAnuncios(NEWS_FALLBACK);
      } finally {
        setLoadingAnuncios(false);
      }
    })();
  }, []);

  // Funciones para navegación entre modales
  const handleOpenLogin = () => setShowLogin(true);
  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  const handleOpenForgot = () => {
    setShowLogin(false);
    setShowForgot(true);
  };
  const handleCloseLogin = () => setShowLogin(false);

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
          {/* Si quieres, podrías mostrar un mensaje mientras carga,
              pero el carrusel igual funciona con el fallback */}
          <Carousel items={anuncios} />
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
