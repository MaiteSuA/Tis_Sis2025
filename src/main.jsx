import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/App.css";
import "./styles/ui.css";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter es necesario para usar las rutas en la aplicación */}
    <BrowserRouter>
     {/* Routes define los grupos de rutas */}
      <App />  
    </BrowserRouter>
  </React.StrictMode>
);


