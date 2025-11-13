//  IMPORTACIONES: Componentes y recursos necesarios
import { NavLink } from "react-router-dom"; //  Componente para navegación con estado activo
import logo from "../assets/logo.jpg"; //  Imagen del logo de la aplicación

//  CONFIGURACIÓN DE PESTAÑAS: Define la estructura de navegación
const tabs = [
  { to: "/", label: "Inicio", end: true }, //  Ruta principal con "end: true" para coincidencia exacta
  //{ to: "/evaluadores", label: "Evaluadores" }, //  Pestaña para gestión de evaluadores
  { to: "/resultados", label: "Resultados" }, //  Pestaña para visualización de resultados
  { to: "/medallero", label: "Medallero" }, //  Pestaña para tabla de medallero
  { to: "/login", label: "Iniciar Sesion" }, //  Pestaña para acceso al sistema
];

//  COMPONENTE NAVBAR: Barra de navegación principal
export default function Navbar() {
  //  ESTILOS BASE: Clases comunes para todos los botones de navegación
  const base = "px-3 py-1 rounded-md text-sm transition border font-medium no-underline";
  
  // ESTILOS ACTIVOS: Apariencia cuando una pestaña está seleccionada
  const active = "bg-gray-200 border-gray-300 text-gray-800 shadow-inner";
  
  //  ESTILOS INACTIVOS: Apariencia normal y efectos hover
  const inactive = "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100";

  return (
    //  CONTENEDOR PRINCIPAL: Header fijo en la parte superior
    <header className="w-screen bg-white border-b sticky top-0 z-50">
      
      {/*  CONTENEDOR INTERNO: Flexbox para alinear logo y navegación */}
      <div className="w-full h-16 flex items-center px-8">
        
        {/*  SECCIÓN LOGO: Logo de la aplicación (actualmente no clickeable) */}
        <div className="flex items-center gap-3">
          {/* 
             LOGO: Imagen del sistema
            🧩 NOTA: Para hacerlo clickeable, envolver con <NavLink to="/">
          */}
          <img 
            src={logo} 
            alt="OhSanSi" 
            className="h-10 w-auto" 
          />
          <span className="font-bold text-xl text-gray-800">
            {/*  TEXTO VACÍO: Espacio para nombre de la aplicación si se desea agregar */}
          </span>
        </div>

        {/*  SECCIÓN NAVEGACIÓN: Menú de pestañas alineado a la derecha */}
        <nav className="ml-auto flex items-center gap-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to} // KEY ÚNICA: Necesaria para el mapeo de React
              to={t.to} //  RUTA DESTINO: Donde navega el enlace
              end={t.end} //  COINCIDENCIA EXACTA: Solo para ruta "/"
              
              //  CLASES DINÁMICAS: Cambian según si la ruta está activa
              className={({ isActive }) =>
                `${base} ${
                  isActive ? active : inactive
                } !text-gray-700 hover:!text-gray-900`
              }
            >
              {t.label} {/*  TEXTO DE LA PESTAÑA */}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}