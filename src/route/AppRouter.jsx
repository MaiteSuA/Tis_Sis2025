import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Evaluadores from "../pages/Evaluadores.jsx";
import Resultados from "../pages/Resultados.jsx";
import Medallero from "../pages/Medallero.jsx";
import Forbidden from "../pages/Forbidden.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluadores" element={<Evaluadores />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/medallero" element={<Medallero />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allow={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
