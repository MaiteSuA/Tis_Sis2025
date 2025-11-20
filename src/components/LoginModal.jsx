// components/LoginModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";

const ROLE_ROUTES = {
  ADMIN: "/admin",
  COORDINADOR: "/coordinador",
  EVALUADOR: "/evaluador",
  RESPONSABLE: "/responsable",
};

export default function LoginModal({
  open,
  onClose,
  onOpenRegister,
  onOpenForgot, // 👈 importante para abrir el modal de recuperar contraseña
}) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 👇 Esto debe coincidir con tu loginApi/backend
      const result = await loginApi({
        correo,
        password,
      });

      console.log("✅ Login ok:", result);

      if (!result.ok) {
        throw new Error(result.error || "Credenciales incorrectas");
      }

      // Guarda token si llega
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      setLoginSuccess(true);

      setTimeout(() => {
        const rolBackend = result?.usuario?.rol || result?.rol || "";
        const rolNormalizado =
          typeof rolBackend === "string" ? rolBackend.toUpperCase() : "";

        const path = ROLE_ROUTES[rolNormalizado] || "/";

        setLoginSuccess(false);
        onClose();
        navigate(path);
      }, 1500);
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = () => {
    onClose();
    if (onOpenRegister) onOpenRegister();
  };
/*
  const handleOpenForgot = () => {
    if (loading || loginSuccess) return;
    onClose();
    if (onOpenForgot) onOpenForgot();
  };
*/
const handleOpenForgot = () => {
  console.log("🎯 CLIC en Recuperar contraseña - Antes de cerrar LoginModal");
  console.log("🎯 showLogin actual:", open); // debería ser true
  
  if (loading || loginSuccess) {
    console.log("🚫 Bloqueado - loading:", loading, "loginSuccess:", loginSuccess);
    return;
  }
  
  console.log("🔄 Cerrando LoginModal y abriendo ForgotPasswordModal");
  onClose(); // Esto cierra el LoginModal
  
  if (onOpenForgot) {
    console.log("✅ EJECUTANDO onOpenForgot");
    onOpenForgot(); // Esto debería abrir ForgotPasswordModal
  } else {
    console.log("❌ ERROR: onOpenForgot no está definido");
  }
};
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
          disabled={loading || loginSuccess}
        >
          ✕
        </button>

        {/* Overlay de éxito */}
        {loginSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-3xl flex flex-col items-center justify-center z-10">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <p className="text-lg font-semibold text-gray-800">
                Inicio de sesión
              </p>
              <p className="text-lg font-semibold text-green-600">Exitoso</p>
              <p className="text-sm text-gray-600 mt-2">Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700">Bienvenido a</p>
          <p className="text-2xl font-extrabold">
            <span className="text-[rgb(126,123,117)]">Oh</span>
            <span className="text-[#adafb4]">SanSi</span>
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-700 tracking-wide">
            INICIAR SESIÓN
          </p>
        </div>

        {/* Formulario */}
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
                disabled={loading || loginSuccess}
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
                disabled={loading || loginSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 text-lg"
                title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading || loginSuccess}
              >
                👁️
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
          )}

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading || loginSuccess}
            className="w-full mt-2 bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full text-sm transition disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>

          {/* Recuperar contraseña */}
          <div className="text-center mt-3">
            <button
              type="button"
              className="text-xs text-[#1E3A8A] hover:underline"
              onClick={handleOpenForgot}
              disabled={loading || loginSuccess}
            >
              Recuperar contraseña
            </button>
          </div>

          {/* Ir a registro */}
          <p className="text-center text-xs mt-2 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              className="text-[#1E3A8A] font-semibold hover:underline"
              onClick={handleOpenRegister}
              disabled={loading || loginSuccess}
            >
              Registrarse
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
