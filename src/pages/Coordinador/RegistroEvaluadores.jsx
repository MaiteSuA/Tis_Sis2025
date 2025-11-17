// src/pages/Coordinador/RegistroEvaluadores.jsx
import { useState } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";

export default function RegistroEvaluadores() {
  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    area: "",
  });

  // Datos de muestra (se reemplazarán con backend después)
  const [evaluadores, setEvaluadores] = useState([
    { id: 1, nombre: "Ana Pérez", email: "ana@sansi.edu", area: "Matemática" },
    { id: 2, nombre: "Luis Soto", email: "luis@sansi.edu", area: "Física" },
    { id: 3, nombre: "Diego Rivera", email: "diego@sansi.edu", area: "Biología" },
  ]);

  // Control simple del formulario
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limpiarFormulario() {
    setForm({ nombre: "", email: "", telefono: "", area: ""});
  }

  function registrarEvaluador() {
    if (!form.nombre || !form.email || !form.area) {
      alert("⚠️ Debes llenar al menos nombre, email y área.");
      return;
    }

    const nuevo = {
      id: evaluadores.length + 1,
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      area: form.area,
    };

    setEvaluadores([...evaluadores, nuevo]);
    limpiarFormulario();

    alert("✅ Evaluador registrado (solo front)");
  }

  return (
    <div className="container-app">
      <TopNav />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-gray-700 mb-4">
            Registro de Evaluadores
          </h1>

          {/* Card del formulario */}
          <div className="card p-6 mb-6 space-y-4">
            <h2 className="font-semibold text-gray-700 mb-2">Datos del Evaluador</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre</label>
                <input
                  className="input w-full"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del evaluador"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  className="input w-full"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
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
                />
              </div>

              <div>
                <label className="label">Área</label>
                <select
                  className="input w-full"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar área</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Biología">Biología</option>
                  <option value="Informática">Informática</option>
                  <option value="Robótica">Robótica</option>
                </select>
              </div>

            </div>

            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={registrarEvaluador}>
                Registrar Evaluador
              </button>
              <button className="btn" onClick={limpiarFormulario}>
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla de evaluadores */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              Evaluadores Registrados
            </h2>

            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Área</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluadores.map((e) => (
                    <tr key={e.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{e.nombre}</td>
                      <td className="p-2">{e.email}</td>
                      <td className="p-2">{e.area}</td>
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
