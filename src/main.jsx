import React from 'react'
import ReactDOM from 'react-dom/client'
// La librería de ruteo para la navegación de la aplicación
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Componente principal de la aplicación. Es la base de todo.
import App from './App.jsx'
// El archivo CSS con los estilos globales y las directivas de Tailwind
import './styles/index.css'
// Componente de ejemplo de Tailwind. Se puede eliminar cuando no se necesite.
import Ejemplo from './components/ejemplo.jsx';
import EvaluacionesClasificatoria from "./pages/Registrar-notas.jsx";
import RevisarEvaluaciones from "./pages/Revisar-evaluaciones.jsx";

// El 'root' es el punto de entrada de la aplicación en el DOM
ReactDOM.createRoot(document.getElementById('root')).render(
   // <React.StrictMode> ayuda a encontrar problemas en el código durante el desarrollo
  <React.StrictMode>
    {/* BrowserRouter es necesario para usar las rutas en la aplicación */}
    <BrowserRouter>
     {/* Routes define los grupos de rutas */}
      <Routes>
        {/*
          Esta es la ruta principal.
          La 'path'="/" es la página de inicio, y 'element' renderiza el componente App.
        */}
        <Route path="/" element={<App />} />
         {/*
          Esta es una ruta de ejemplo para mostrar el uso de Tailwind.
          Se puede eliminar una vez que ya no se necesite.
        */}
        <Route path="/tailwind-example" element={<Ejemplo />} />
        <Route path="/" element={<App />} />
        <Route path="/registrar-notas" element={<EvaluacionesClasificatoria/>} />
        <Route path="/revisar-evaluacion" element={<RevisarEvaluaciones/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)


