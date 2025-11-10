// Importación de componentes y dependencias necesarias
import Navbar from "../components/Navbar";          // Barra superior
import { useState } from "react";                  // Hook para manejar estados
import Carousel from "../components/Carousel";     // Carrusel de imágenes o noticias
import { useNavigate } from "react-router-dom";    // Hook para redirigir entre rutas
import { loginApi } from "../api/auth";            // Función API para autenticar usuario

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

// Rutas de destino según el rol seleccionado
const ROLE_ROUTES = {
  "Administrador": "/admin",
  "Coordinador Area": "/coordinador",
  "Evaluador": "/evaluador",
  "Responsable de Area": "/responsable",
};

export default function Login() {
  // Estados del componente (React Hooks)
  const [role, setRole] = useState(ROLES[0]);   // Rol seleccionado (por defecto: primero)
  const [showPwd, setShowPwd] = useState(false); // Mostrar/ocultar contraseña
  const [username, setUsername] = useState('');  // Usuario ingresado
  const [password, setPassword] = useState('');  // Contraseña ingresada
  const [loading, setLoading] = useState(false); // Controla si está procesando el login
  const [error, setError] = useState('');        // Guarda mensajes de error
  const navigate = useNavigate();                // Permite redirigir entre páginas

  // 👉 Función que maneja el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Enviando login:', { username, password, role });
      
      // Llama al backend (loginApi) con los datos del formulario
      const result = await loginApi({ username, password, role });
      console.log('✅ Login exitoso:', result);
      
      // Redirige al dashboard correspondiente según el rol
      const path = ROLE_ROUTES[role] || "/";
      console.log('🔄 Redirigiendo a:', path);
      navigate(path);
      
    } catch (err) {
      // Si falla la petición o credenciales, muestra error
      console.error('❌ Error en login:', err);
      setError(err.message || 'Error en el login');
    } finally {
      // Desactiva el estado de carga al finalizar
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      {/* 🔹 Navbar principal */}
      <Navbar />

      {/* Sección principal dividida en 2 columnas (Carrusel y Login) */}
      <section className="w-screen h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
        
        {/* 🖼️ Columna izquierda: Carrusel */}
        <div className="h-full bg-gray-300 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <Carousel items={news} /> {/* Carrusel con las noticias definidas arriba */}
          </div>
        </div>

        {/* 🔐 Columna derecha: Formulario de login */}
        <div className="h-full bg-gray-200 flex items-center justify-center px-6">
          <div className="w-full max-w-xl">
            
            {/* 🧩 Tabs para cambiar de rol */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-700">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button" // Importante: evita que se dispare el submit
                  onClick={() => setRole(r)} // Cambia el rol seleccionado
                  className={`pb-1 border-b-2 transition ${
                    role === r ? "border-gray-800 text-gray-900" : "border-transparent hover:border-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* 📋 Formulario de login */}
            <form onSubmit={handleLogin} className="bg-white/80 rounded-3xl shadow p-8 md:p-10">
              
              {/* Avatar o ícono genérico */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-6" />

              {/* Campo: Usuario */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
                required
              />

              {/* Campo: Contraseña con botón de mostrar/ocultar */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <div className="relative mb-6">
                <input
                  type={showPwd ? "text" : "password"} // alterna entre visible/oculto
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  👁️
                </button>
              </div>

              {/* Muestra mensaje de error si existe */}
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Botón para iniciar sesión */}
              <button
                type="submit"
                disabled={loading}
                onClick={handleLogin} // (opcional, el form ya llama a handleLogin)
                className="
                  w-full rounded-md 
                  !bg-gray-700 hover:!bg-gray-800 
                  !text-white font-semibold py-2 shadow-md 
                  transition !opacity-100 relative z-10
                  disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>

              {/* Texto informativo con el rol seleccionado */}
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
