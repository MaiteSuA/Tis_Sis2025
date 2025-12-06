// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./styles/App.css";
import "./styles/ui.css";
import "./styles/index.css";

import EvaluacionesClasificatoria from "./pages/Registrar-notas.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Rutas principales */}
      

      {/* El enrutador principal del sistema */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
