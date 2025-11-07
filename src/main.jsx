// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
// La librería de ruteo para la navegación de la aplicación
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Componente principal de la aplicación. Es la base de todo.
import App from "./App.jsx";
// El archivo CSS con los estilos globales y las directivas de Tailwind
import "./styles/index.css";
// Componente de ejemplo de Tailwind. Se puede eliminar cuando no se necesite.
import Ejemplo from "./components/ejemplo.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
