import React from 'react'
import ReactDOM from 'react-dom/client'
// La librería de ruteo para la navegación de la aplicación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Componente principal de la aplicación. Es la base de todo.
import App from './App.jsx'
import Login from './pages/Login.jsx'
// El archivo CSS con los estilos globales y las directivas de Tailwind
import './styles/index.css'
// Componente de ejemplo de Tailwind. Se puede eliminar cuando no se necesite.
import Ejemplo from './components/ejemplo.jsx';

// El 'root' es el punto de entrada de la aplicación en el DOM
ReactDOM.createRoot(document.getElementById('root')).render(
   // <React.StrictMode> ayuda a encontrar problemas en el código durante el desarrollo
  <React.StrictMode>
    {/* BrowserRouter es necesario para usar las rutas en la aplicación */}
      <BrowserRouter>
     {/* Routes define los grupos de rutas */}
      <Routes>
        {/* Redirige la raíz al login para que la app muestre la página de inicio real */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
        {/* Ejemplo de Tailwind - opcional */}
        <Route path="/tailwind-example" element={<Ejemplo />} />
        {/* Mantener App en otra ruta si la necesitas */}
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)


