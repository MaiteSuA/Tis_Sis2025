// Importación de componentes y dependencias necesarias
import Navbar from "../components/Navbar";          // Barra superior
import { useState } from "react";                  // Hook para manejar estados
import Carousel from "../components/Carousel";     // Carrusel de imágenes o noticias
import { useNavigate } from "react-router-dom";    // Hook para redirigir entre rutas
import { loginApi } from "../api/auth";           // Función API para autenticar usuario
import RegisterModal from "../components/RegisterModal"; // Modal de registro

// Noticias que se muestran en el carrusel
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

// Lista de roles disponibles para loguearse
const ROLES = ["Administrador", "Coordinador Area", "Evaluador", "Responsable de Area"];

const ROLE_ROUTES = {
  Administrador: "/admin",
  "Coordinador Area": "/coordinador",
  Evaluador: "/evaluador",
  "Responsable de Area": "/responsable",
};

export default function Login() {
  const [role, setRole] = useState(ROLES[0]);
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginApi({ username, password, role });
      console.log("✅ Login exitoso:", result);

      const path = ROLE_ROUTES[role] || "/";
      navigate(path);
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      <Navbar />

      <section className="w-screen h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
        <div className="h-full bg-gray-300 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <Carousel items={news} />
          </div>
        </div>

        <div className="h-full bg-gray-200 flex items-center justify-center px-6">
          <div className="w-full max-w-xl">
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-700">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`pb-1 border-b-2 transition ${
                    role === r
                      ? "border-gray-800 text-gray-900"
                      : "border-transparent hover:border-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleLogin}
              className="bg-white/80 rounded-3xl shadow p-8 md:p-10"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-6" />

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
                required
              />

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contraseña
              </label>
              <div className="relative mb-6">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  👁️
                </button>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full rounded-md 
                  !bg-gray-700 hover:!bg-gray-800 
                  !text-white font-semibold py-2 shadow-md 
                  transition !opacity-100 relative z-10
                  disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">
                Rol seleccionado: <span className="font-medium">{role}</span>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}