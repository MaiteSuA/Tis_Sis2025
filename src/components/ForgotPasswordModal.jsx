// components/ForgotPasswordModal.jsx
import { useState } from "react";
import { sendResetCodeApi } from "../api/auth";

export default function ForgotPasswordModal({ open, onClose, onSuccess }) {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
//si no esta abierto
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //  AQUÍ LLAMAMOS AL BACKEND
      const res = await sendResetCodeApi({ correo });
      console.log(" Código enviado:", res);

      // Si todo ok, avisamos al padre
      if (onSuccess) onSuccess(correo);
    } catch (err) {
      console.error(" Error enviando código:", err);
      setError(err.message || "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  };
//estructura del modal
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-[101]">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-center text-xl font-bold text-[#777c7a] mb-6">
          Recuperar contraseña
        </h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          Ingresa el correo con el que te registraste
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="border rounded-md flex items-center px-3 py-2">
              📧
              <input
                type="email"
                className="w-full outline-none ml-2 text-sm"
                placeholder="usuario@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Siguiente"}
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
