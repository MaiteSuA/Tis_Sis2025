import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Evaluadores from "../pages/Evaluadores.jsx";
import Resultados from "../pages/Resultados.jsx";
import Medallero from "../pages/Medallero.jsx";
import Forbidden from "../pages/Forbidden.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import Ejemplo from "../pages/ejemplo.jsx";
import Ejemplo2 from "../pages/ejemplo2.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
//importar las vitas por rol aca, cambiar su ruta y tambien reemplazar 

/*
import AdminDashboard from "../pages/ejemplo.jsx";

import CoordinadorDashboard from "../views/coordinador/CoordinadorDashboard.jsx";
import EvaluadorDashboard from "../views/evaluador/EvaluadorDashboard.jsx";
import ResponsableDashboard from "../views/responsable/ResponsableDashboard.jsx";
*/
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluadores" element={<Evaluadores />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/medallero" element={<Medallero />} />
        <Route path="/login" element={<Login />} />
        {/*Rutas por rol 
        una vez que se haya cambiado a las rutas correspondiente, por favor borrar eso que solo fue ejemplo na mas */}
        
        <Route path="/admin" element={<Ejemplo />} />
        <Route path="/coordinador" element={<Ejemplo2 />} />
        <Route path="/evaluador" element={<Ejemplo />} />
        <Route path="/responsable" element={<Ejemplo2 />} />

        

        <Route element={<ProtectedRoute allow={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
