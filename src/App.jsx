import { Routes, Route, Navigate } from "react-router-dom";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLog from "./pages/AdminLog";  // asegúrate de tener este archivo

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminUsuarios />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      <Route path="/admin/log" element={<AdminLog />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


