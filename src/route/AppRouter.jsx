import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Evaluadores from "../pages/Evaluadores.jsx";
import Resultados from "../pages/Resultados.jsx";
import Medallero from "../pages/Medallero.jsx";
import Forbidden from "../pages/Forbidden.jsx";
import AdminUsuarios from "../pages/AdminUsuarios.jsx";
import AdminLog from "../pages/AdminLog.jsx";
import ResponsableArea from "../pages/Revisar-evaluaciones.jsx"
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
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/evaluadores" element={<Evaluadores />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/medallero" element={<Medallero />} />
        <Route path="/login" element={<Login />} />
        {/*Rutas por rol 
        una vez que se haya cambiado a las rutas correspondiente, por favor borrar eso que solo fue ejemplo na mas */}
        <Route path="/admin" element={<AdminUsuarios />} />
        <Route path="/admin/log" element={<AdminLog />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
 

        <Route path="/coordinador" element={<Ejemplo2 />} />
        <Route path="/evaluador" element={<Ejemplo />} />
        <Route path="/responsable" element={<ResponsableArea />} />
        
        {/* Layout de Admin con rutas anidadas */}
      {/* Si quieres proteger luego, envuelve esto con ProtectedRoute y usa <Outlet/> ahí también */}
          
        {/* Protegidas por rol */}
        <Route element={<ProtectedRoute allow={['ADMIN']} />}>
          
         
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}
