import Navbar from "../components/Navbar";
import { useState } from "react";
import Carousel from "../components/Carousel";
//importes back

import { loginApi } from "../api/auth";

const news = [
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

const ROLES = ["Administrador", "Coordinador", "Evaluador", "Responsable de Area"];

export default function Login() {
  const [role, setRole] = useState(ROLES[0]);
  const [showPwd, setShowPwd] = useState(false);
  // const navigate = useNavigate(); // si quieres redirigir después de login

  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Alto = pantalla menos la barra (h-16) */}
      <section className="w-screen h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
        {/* Izquierda: carrusel a pantalla completa dentro de su mitad */}
        <div className="h-full bg-gray-300 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <Carousel items={news} />
          </div>
        </div>

        {/* Derecha: formulario con tabs de rol */}
        <div className="h-full bg-gray-200 flex items-center justify-center px-6">
          <div className="w-full max-w-xl">
            {/* Tabs de roles */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-700">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`pb-1 border-b-2 transition ${
                    role === r ? "border-gray-800 text-gray-900" : "border-transparent hover:border-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Tarjeta de login */}
            <div className="bg-white/80 rounded-3xl shadow p-8 md:p-10">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-6" />

              {/* Usuario */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
              <input
                type="text"
                placeholder="Usuario"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
              />

              {/* Contraseña */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <div className="relative mb-6">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="********"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  👁️
                </button>
              </div>

              {/* Ingresar */}
              <button
                // onClick={() => navigate("/")} // ejemplo
                className="w-full rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 transition"
              >
                Ingresar
              </button>

              {/* Info del rol seleccionado */}
              <p className="text-center text-xs text-gray-500 mt-3">
                Rol seleccionado: <span className="font-medium">{role}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
/*
//backend simulacion
export default function LoginBack() {
  const [role, setRole] = useState("Administrador");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const password = form.get("password");
    try {
      await loginApi({ username, password, role });
      // redirige a tu ruta que corresponda
      window.location.href = "/"; // o /dashboard
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  }
*/

  //return (
  //  <div className="min-h-screen w-screen bg-white overflow-x-hidden">
  //    {/* ... tu Navbar y carrusel */}
  /*    <form onSubmit={handleSubmit} className="bg-white/80 rounded-3xl shadow p-8 md:p-10">
        {/* inputs */
      //}
      /*
        <input name="username" type="text" placeholder="Usuario" className="w-full rounded-md border px-4 py-2 mb-4" />
        <div className="relative mb-6">
          <input name="password" type={showPwd ? "text" : "password"} placeholder="********" className="w-full rounded-md border px-4 py-2 pr-10" />
          <button type="button" onClick={() => setShowPwd(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2">👁️</button>
        </div>
        <button disabled={loading} className="w-full rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2">
          {loading ? "Ingresando..." : "Ingresar"}
        </button> /*
        {err && <p className="text-red-600 mt-2 text-sm">{err}</p>}
        <p className="text-center text-xs text-gray-500 mt-3">Rol seleccionado: <b>{role}</b></p>
      </form>
    </div>
  );
}
*/
