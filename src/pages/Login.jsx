//  IMPORTACIONES: Componentes y hooks necesarios
import Navbar from "../components/Navbar"; // Componente de barra de navegación
import { useState } from "react"; // Hook para manejar estado del componente
import Carousel from "../components/Carousel"; // Componente de carrusel para noticias
import { useNavigate } from "react-router-dom"; // Hook para navegación programática
//import { loginApi } from "../api/auth"; // 🔹 COMENTADO: Función de API deshabilitada temporalmente

//  DATOS ESTÁTICOS: Array de noticias para mostrar en el carrusel
const news = [
  {
    title: "Convocatoria Oficial 2025 publicada",
    description: "Revisa fechas y requisitos para las Olimpiadas OhSanSi.",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Capacitación a Evaluadores",
    description: "Sesiones intro y rúbricas de evaluación por áreas.",
    image: "https://images.unsplash.com/photo-1523580846011-8a49fd8d1a76?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Clasificatorias regionales",
    description: "Cronograma y sedes confirmadas para las pruebas.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
  },
];

//  ROLES DEL SISTEMA: Tipos de usuarios que pueden acceder al sistema
const ROLES = ["Administrador", "Coordinador", "Evaluador", "Responsable de Area"];

//  RUTAS POR ROL: Mapeo de cada rol con su ruta correspondiente
const ROLE_ROUTES = {
  "Administrador": "/admin", // Ruta para administradores
  "Coordinador": "/coordinador", // Ruta para coordinadores
  "Evaluador": "/evaluador", // Ruta para evaluadores
  "Responsable de Area": "/responsable", // Ruta para responsables de área
};

//  COMPONENTE PRINCIPAL: Login (VERSIÓN SIMULADA - SIN AUTENTICACIÓN REAL)
export default function Login() {
  //  ESTADOS DEL COMPONENTE:
  const [role, setRole] = useState(ROLES[0]); // Estado para el rol seleccionado
  const [showPwd, setShowPwd] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate(); // Hook para navegación entre rutas

  //  FUNCIÓN DE REDIRECCIÓN: Navega directamente sin validar credenciales
  const goToRole = () => {
    const path = ROLE_ROUTES[role] || "/"; // Obtiene la ruta según el rol seleccionado
    navigate(path); // Navega a la ruta correspondiente
  };

  //  RENDERIZADO DEL COMPONENTE
  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      {/*  COMPONENTE NAVBAR: Barra de navegación superior */}
      <Navbar />

      {/*  SECCIÓN PRINCIPAL: Divide la pantalla en dos columnas */}
      <section className="w-screen h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
        
        {/*  COLUMNA IZQUIERDA: Carrusel de noticias */}
        <div className="h-full bg-gray-300 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            {/*  COMPONENTE CARRUSEL: Muestra las noticias en formato deslizante */}
            <Carousel items={news} />
          </div>
        </div>

        {/*  COLUMNA DERECHA: Formulario de login (SIMULADO) */}
        <div className="h-full bg-gray-200 flex items-center justify-center px-6">
          <div className="w-full max-w-xl">
            
            {/*  SELECTOR DE ROLES: Tabs para seleccionar tipo de usuario */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-700">
              {ROLES.map((r) => (
                <button
                  key={r} // Key única para cada botón
                  onClick={() => setRole(r)} // Cambia el rol al hacer click
                  className={`pb-1 border-b-2 transition ${
                    role === r 
                      ? "border-gray-800 text-gray-900" // Estilo cuando está activo
                      : "border-transparent hover:border-gray-400" // Estilo cuando está inactivo
                  }`}
                >
                  {r} {/* Texto del rol */}
                </button>
              ))}
            </div>

            {/* TARJETA DE LOGIN: Contenedor del formulario  */}
            <div className="bg-white/80 rounded-3xl shadow p-8 md:p-10">
              
              {/* AVATAR PLACEHOLDER: Imagen de perfil temporal */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-6" />

              {/* CAMPO DE USUARIO (NO FUNCIONAL) */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
              <input
                type="text"
                placeholder="Usuario"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
                //  NOTA: No hay value ni onChange - campo de solo visualización
              />

              {/*  CAMPO DE CONTRASEÑA CON TOGGLE DE VISIBILIDAD (NO FUNCIONAL) */}
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <div className="relative mb-6">
                <input
                  type={showPwd ? "text" : "password"} // Alterna entre texto y contraseña (solo visual)
                  placeholder="********"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400"
                  // 🔹 NOTA: No hay value ni onChange - campo de solo visualización
                />
                {/* 🔹 BOTÓN TOGGLE VISIBILIDAD: Solo cambia la visualización */}
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)} // Alterna el estado booleano
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"} // 🔹 Accesibilidad
                  title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"} // 🔹 Tooltip
                >
                  👁️ {/* Icono de ojo */}
                </button>
              </div>

              {/*  BOTÓN DE INGRESAR: Redirige directamente sin validación */}
              <button
                type="button" // Tipo button para evitar comportamiento de formulario
                onClick={goToRole} // Ejecuta la función de redirección
                className="
                  w-full rounded-md  
                  !bg-gray-700 hover:!bg-gray-800  
                  !text-white font-semibold py-2 shadow-md 
                  transition !opacity-100 relative z-10"
              >
                Ingresar {/* Texto estático - no hay estado de carga */}
              </button>

              {/*  INDICADOR DE ROL SELECCIONADO: Muestra el rol actual */}
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

