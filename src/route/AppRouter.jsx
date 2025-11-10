import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Evaluadores from "../pages/Evaluadores.jsx";
import Resultados from "../pages/Resultados.jsx";
import Medallero from "../pages/Medallero.jsx";
import Forbidden from "../pages/Forbidden.jsx";
import AdminUsuarios from "../pages/AdminUsuarios.jsx";
import AdminLog from "../pages/AdminLog.jsx";
import ResponsableArea from "../pages/Revisar-evaluaciones.jsx";
import Ejemplo from "../pages/ejemplo.jsx";
import Ejemplo2 from "../pages/ejemplo2.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RegistrarNotasReplanteado from "../pages/Registrar-notas.jsx";
import ImportarInscritos from "../pages/ImportarInscritos.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/evaluadores" element={<Evaluadores />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/medallero" element={<Medallero />} />
      <Route path="/login" element={<Login />} />

      {/* ← Hacerla pública */}
      {/* Demos por rol */}
      <Route path="/admin" element={<AdminUsuarios />} />
      <Route path="/admin/log" element={<AdminLog />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      <Route path="/coordinador" element={<ImportarInscritos />} />
      <Route path="/evaluador" element={<RegistrarNotasReplanteado />} />
      <Route path="/responsable" element={<ResponsableArea />} />
      {/* Protegidas por rol */}
      <Route element={<ProtectedRoute allow={["ADMIN"]} />}>
        {/* coloca aquí SOLO rutas que realmente requieran ADMIN */}
        {/* <Route path="/admin/otra-ruta" element={<Algo />} /> */}
      </Route>
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
