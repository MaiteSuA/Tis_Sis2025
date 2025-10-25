import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Evaluadores from "../pages/Evaluadores";
import Resultados from "../pages/Resultados";
import Medallero from "../pages/Medallero";
import Forbidden from "../pages/Forbidden";
import ProtectedRoute from "./ProtectedRoute"; // ya existente
import AdminUsers from "../pages/AdminUsers";
// agrega aquí tus otras páginas protegidas...

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluadores" element={<Evaluadores />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/medallero" element={<Medallero />} />
        <Route path="/login" element={<Login />} />

        {/* ejemplo de ruta protegida */}
        <Route element={<ProtectedRoute allow={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

