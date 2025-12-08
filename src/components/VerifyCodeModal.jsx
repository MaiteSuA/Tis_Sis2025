//verifycodemodal
import { useState } from "react";
import { verifyResetCodeApi } from "../api/auth";
//estructura del modal
export default function VerifyCodeModal({ open, correo, onClose, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyResetCodeApi({ correo, code });

      if (res.ok) {
        onVerified(); // pasa al último modal
      } else {
        setError(res.error || "Código incorrecto");
      }
    } catch {
      setError("Error verificando código");
    } finally {
      setLoading(false);
    }
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
          Verificar código
        </h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          Hemos enviado un código de 6 dígitos a <span className="font-semibold">{correo}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border rounded-md px-3 py-2">
            <input
              type="text"
              maxLength="6"
              className="w-full outline-none text-center tracking-widest text-lg"
              placeholder="______"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a19f99] hover:bg-[#c4bfba] text-white font-semibold py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Siguiente"}
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
