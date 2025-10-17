import { useState } from "react";
import { login, setSession } from "../servicios/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      // backend debe responder { token, user: {id,name,role,email} }
  const { token, user } = await login(email, password);
  // set both token and user in localStorage
  setSession({ token, user });
      location.href = "/"; // redirige al home segun navbar
    } catch (e) {
      setErr(e.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-xl p-6 space-y-3">
        <h1 className="text-xl font-semibold text-center">Iniciar sesión</h1>
        <div>
          <label className="block text-sm">Correo</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? "Ingresando..." : "Ingresar"}</button>
      </form>
    </div>
  );
}

