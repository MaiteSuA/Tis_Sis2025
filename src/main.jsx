// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./styles/App.css";
import "./styles/ui.css";
import "./styles/index.css";

import EvaluacionesClasificatoria from "./pages/Registrar-notas.jsx";
import RevisarEvaluaciones from "./pages/Revisar-evaluaciones.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Rutas principales */}
      <Routes>
        <Route path="/registrar-notas" element={<EvaluacionesClasificatoria />} />
        <Route path="/revisar-evaluacion" element={<RevisarEvaluaciones />} />
      </Routes>

      {/* El enrutador principal del sistema */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
