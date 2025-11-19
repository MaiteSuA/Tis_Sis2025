// components/LoginModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";

const ROLE_ROUTES = {
  ADMINISTRADOR: "/admin",
  "COORDINADOR AREA": "/coordinador",
  EVALUADOR: "/evaluador",
  "RESPONSABLE DE AREA": "/responsable",
};

export default function LoginModal({ open, onClose, onOpenRegister }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi({
        username: correo,
        password,
        role: "Administrador",
      });

      console.log("✅ Login exclusivo ok:", result);

      const rolBackend =
        result?.user?.rol ||
        result?.rol ||
        result?.user?.ROL ||
        result?.ROL ||
        "";

      const rolNormalizado =
        typeof rolBackend === "string" ? rolBackend.toUpperCase() : "";

      const path = ROLE_ROUTES[rolNormalizado] || "/";

      onClose();
      navigate(path);
    } catch (err) {
      console.error("❌ Error en login exclusivo:", err);
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de registro
  const handleOpenRegister = () => {
    onClose(); // Cierra el modal de login
    if (onOpenRegister) {
      onOpenRegister(); // Abre el modal de registro
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Bienvenido a
          </p>
          <p className="text-2xl font-extrabold">
            <span className="text-[rgb(126,123,117)]">Oh</span>
            <span className="text-[#adafb4]">SanSi</span>
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-700 tracking-wide">
            INICIAR SESIÓN
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Correo
            </label>
            <div className="border rounded-md flex items-center px-3 py-2">
              <span className="mr-2 text-gray-500">📧</span>
              <input
                type="email"
                className="w-full outline-none text-sm"
                placeholder="tu_correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Contraseña
            </label>
            <div className="border rounded-md flex items-center px-3 py-2 relative">
              <span className="mr-2 text-gray-500">🔑</span>
              <input
                type={showPwd ? "text" : "password"}
                className="w-full outline-none text-sm pr-8"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 text-lg"
                title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                👁️
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full text-sm transition disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="text-xs text-[#1E3A8A] hover:underline"
            >
              Recuperar contraseña
            </button>
          </div>

          <p className="text-center text-xs mt-2 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              className="text-[#1E3A8A] font-semibold hover:underline"
              onClick={handleOpenRegister}
            >
              Registrarse
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}