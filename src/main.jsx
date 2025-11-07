import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./styles/App.css";
import "./styles/ui.css";
import "./styles/index.css";
import Ejemplo from './components/ejemplo.jsx';
import EvaluacionesClasificatoria from "./pages/Registrar-notas.jsx";
import RevisarEvaluaciones from "./pages/Revisar-evaluaciones.jsx";

createRoot(document.getElementById("root")).render(
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
      <App />  
    </BrowserRouter>
  </React.StrictMode>
);


