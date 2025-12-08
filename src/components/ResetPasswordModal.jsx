//resepassword
import { useState } from "react";
import { resetPasswordApi } from "../api/auth";
//estructura del modal
export default function ResetPasswordModal({ open, correo, onClose, onSuccess }) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//si no esta abierto
  if (!open) return null;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
//funcion para enviar la nueva contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(pwd)) {
      setError("La contraseña debe tener 10+ caracteres y símbolos");
      return;
    }

    if (pwd !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordApi({ correo, password: pwd });

      if (res.ok) {
        onSuccess(); // Cerrar y mostrar mensaje
      } else {
        setError(res.error || "Error al cambiar contraseña");
      }
    } catch {
      setError("Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };
//mostrar o ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
//mostrar o ocultar confirmar contraseña
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
//estructura del modal
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-center text-xl font-bold text-[#777c7a] mb-6">
          Nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nueva contraseña */}
          <div>
            <div className="border rounded-md px-3 py-2 flex items-center">
              🔑
              <input
                type={showPassword ? "text" : "password"}
                className="w-full ml-2 outline-none"
                placeholder="Nueva contraseña"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-500 hover:text-gray-700 ml-2"
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <div className="border rounded-md px-3 py-2 flex items-center">
              🔒
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full ml-2 outline-none"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="text-gray-500 hover:text-gray-700 ml-2"
                disabled={loading}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Confirmar"}
          </button>

        </form>

        <button
          className="mt-4 text-sm text-center text-[#1E3A8A] underline w-full"
          onClick={onClose}
          disabled={loading}
        >
          Atrás
        </button>

      </div>
    </div>
  );
}