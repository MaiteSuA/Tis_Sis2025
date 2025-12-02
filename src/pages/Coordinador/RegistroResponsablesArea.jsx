// src/pages/Coordinador/RegistroEvaluadores.jsx
import { useState, useEffect } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";
import {
  getAreas,
  getResponsablesArea,
  createResponsableArea,
} from "../../services/api";

export default function RegistroResponsablesArea() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    id_area: "",
    password: "",
  });

  const [areas, setAreas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar áreas + responsables al entrar
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const [areasData, respData] = await Promise.all([
          getAreas(),
          getResponsablesArea(),
        ]);

        setAreas(areasData || []);

        const mapped = (respData || []).map((r) => ({
          id: r.id_responsable ?? r.id_responsable_area ?? r.id,
          nombreCompleto: `${r.nombres_evaluador ?? ""} ${
            r.apellidos ?? ""
          }`.trim(),
          email: r.correo_electronico ?? r.email,
          telefono: r.usuario?.telefono ?? r.telefono ?? "",
          areaNombre: r.area?.nombre_area ?? "",
        }));

        setResponsables(mapped);
      } catch (e) {
        console.error(e);
        setError("Error cargando datos iniciales");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limpiarFormulario() {
    setForm({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      id_area: "",
      password: "",
    });
  }

  async function registrarResponsable() {
    if (!form.nombre || !form.apellidos || !form.email || !form.id_area) {
      alert("⚠️ Debes llenar nombre, apellidos, email y área.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const creado = await createResponsableArea(form);

      const nuevoUI = {
        id: creado.id_responsable ?? creado.id_responsable_area ?? creado.id,
        nombreCompleto: `${creado.nombres_evaluador ?? ""} ${
          creado.apellidos ?? ""
        }`.trim(),
        email: creado.correo_electronico ?? form.email,
        telefono: creado.usuario?.telefono ?? form.telefono,
        areaNombre: creado.area?.nombre_area ?? "",
      };

      setResponsables((prev) => [...prev, nuevoUI]);
      limpiarFormulario();
      alert("✅ Responsable registrado correctamente");
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al registrar responsable");
      alert("❌ " + (e.message || "Error al registrar responsable"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app">
      <TopNav />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-gray-700 mb-4">
            Registro de Responsables de área
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* Formulario */}
          <div className="card p-6 mb-6 space-y-4">
            <h2 className="font-semibold text-gray-700 mb-2">
              Datos del Responsable de Área
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre</label>
                <input
                  className="input w-full"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre(s) del responsable"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Apellidos</label>
                <input
                  className="input w-full"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  className="input w-full"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Teléfono</label>
                <input
                  className="input w-full"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="77712345"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Área</label>
                <select
                  className="input w-full"
                  name="id_area"
                  value={form.id_area}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccionar área</option>
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Contraseña inicial</label>
                <input
                  className="input w-full"
                  name="password"
                  type="text"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Opcional (por defecto 123456)"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                className="btn btn-primary"
                onClick={registrarResponsable}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Registrar Responsable de área"}
              </button>
              <button
                className="btn"
                onClick={limpiarFormulario}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              Responsables de Área Registrados
            </h2>

            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Teléfono</th>
                    <th className="p-2">Área</th>
                  </tr>
                </thead>
                <tbody>
                  {responsables.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-gray-500"
                      >
                        No hay responsables registrados.
                      </td>
                    </tr>
                  )}

                  {responsables.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{r.nombreCompleto}</td>
                      <td className="p-2">{r.email}</td>
                      <td className="p-2">{r.telefono}</td>
                      <td className="p-2">{r.areaNombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
