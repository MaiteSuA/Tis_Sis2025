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
  
  onOpenForgot,
}) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi({
        correo,
        password,
      });

      console.log(" Login ok:", result);

      if (!result.ok) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 3) {
          setError(
            <span>
              Has superado el número de intentos permitidos.{" "}
              <button
                type="button"
                className="text-blue-600 underline font-semibold hover:text-blue-800"
                onClick={handleOpenForgot}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </span>
          );
          setLoading(false);
          return;
        } else {
          throw new Error(result.error || "Credenciales incorrectas");
        }
      } else {
        // Login exitoso
        setFailedAttempts(0);

        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        setLoginSuccess(true);

        setTimeout(() => {
          const token = result.token;

          // 1) Sacar rol del token (payload)
          let roleFromToken = "";
          try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            roleFromToken = decoded.role; // "ADMIN", "COORDINADOR", "EVALUADOR", "RESPONSABLE"
          } catch (e) {
            console.error("Error decodificando token:", e);
          }

          // 2) También considerar el usuario que pueda venir del backend
          const usuario = result.usuario || result.user || null;
          const finalRole =
            roleFromToken ||
            usuario?.rol ||
            usuario?.role ||
            "";

          // 3) Guardar el usuario normalizado en localStorage
          if (usuario) {
            const userData = {
              ...usuario,
              rol: usuario.rol || finalRole,
              role: usuario.role || finalRole,
            };
            localStorage.setItem("user", JSON.stringify(userData));
          } else if (finalRole) {
            // fallback por si el backend solo envía token
            const userData = {
              correo,
              rol: finalRole,
              role: finalRole,
            };
            localStorage.setItem("user", JSON.stringify(userData));
          }

          console.log(" Rol final detectado:", finalRole);

          // 4) Redirigir según el rol CANÓNICO
          const path = ROLE_ROUTES[finalRole] || "/";
          setLoginSuccess(false);
          onClose();
          navigate(path, { replace: true });
        }, 1500);
      }
    } catch (err) {
      console.error(" Error en login:", err);

      if (failedAttempts < 3) {
        setError(err.message || "Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = () => {
    console.log(" CLIC en Recuperar contraseña - Antes de cerrar LoginModal");

    if (loading || loginSuccess) {
      return;
    }

    console.log(" Cerrando LoginModal y abriendo ForgotPasswordModal");
    onClose();
    setFailedAttempts(0);

    if (onOpenForgot) {
      onOpenForgot();
    }
  };

  const handleClose = () => {
    setFailedAttempts(0);
    onClose();
  };
//estructura del modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
          disabled={loading || loginSuccess}
        >
          ✕
        </button>

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={loading || loginSuccess || failedAttempts >= 3}
              />
            </div>
          </div>

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
                disabled={loading || loginSuccess || failedAttempts >= 3}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 text-lg"
                title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading || loginSuccess || failedAttempts >= 3}
              >
                👁️
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-1 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || loginSuccess || failedAttempts >= 3}
            className="w-full mt-2 bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full text-sm transition disabled:opacity-60"
          >
            {loading
              ? "Verificando..."
              : failedAttempts >= 3
              ? "Límite de intentos alcanzado"
              : "Iniciar sesión"}
          </button>

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
        </form>
      </div>
    </div>
  );
}
