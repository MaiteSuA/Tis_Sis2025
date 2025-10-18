import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";

export default function AdminUsuarios() {
  const [tab, setTab] = useState("RESPONSABLE");
  const [rows, setRows] = useState([]);
  const [areas] = useState([{ id: 1, nombre: "Sistemas" }, { id: 2, nombre: "Industrial" }, { id: 3, nombre: "Civil" }]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (tab === "RESPONSABLE") {
      setRows([{ id: 1, nombres: "María", apellidos: "Pérez", rol: "RESPONSABLE", area: "Sistemas", estado: true, correo: "maria@umss.edu" }]);
    } else {
      setRows([{ id: 2, nombres: "Carlos", apellidos: "Rojas", rol: "EVALUADOR", area: "Industrial", estado: true, correo: "carlos@umss.edu" }]);
    }
  }, [tab]);

  const handleDelete = (id) => setRows(rows.filter(r => r.id !== id));
  const handleEdit   = () => setShowForm(true);
  const handleSave   = (nuevo) => {
    setRows([...rows, { ...nuevo, id: rows.length + 1, rol: tab, area: areas.find(a => a.id === Number(nuevo.areaId))?.nombre }]);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      {/* “Dashboard” tipo breadcrumb como en el mock */}
      <div className="text-sm text-gray-600 mb-2">Dashboard</div>

      {/* 3 tarjetas grises */}
      <section className="space-y-4">
        <div className="panel">
          <label className="section">Numeros de Usuarios Registrados</label>
          <input disabled value={123} className="kpi-input w-40" />
        </div>

        <div className="panel">
          <p className="section">Cantidad de Medallas:</p>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              ["Oro", 123456],
              ["Plata", 123456],
              ["Bronce", 123456],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-gray-700 w-14">{label}:</span>
                <input disabled value={val} className="kpi-input" />
              </div>
            ))}
            <button className="btn-dark ml-auto">Guardar Cambios</button>
          </div>
        </div>

        <div className="panel">
          <span className="section">Estado del proceso:</span>
          <div className="flex items-center gap-8">
            <label className="inline-flex items-center gap-2 text-gray-800">
              <input type="checkbox" defaultChecked className="accent-gray-700" /> En evaluación
            </label>
            <label className="inline-flex items-center gap-2 text-gray-800">
              <input type="checkbox" className="accent-gray-700" /> Concluido
            </label>
          </div>
        </div>
      </section>

      {/* Card blanca: tabs + tabla + footer */}
      <section className="mt-4 card">
        <UsuariosTabs
          tabs={[
            { key: "RESPONSABLE", label: "Tabla de Responsables de área" },
            { key: "EVALUADOR",  label: "Tabla de Evaluadores" },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="p-4">
          <UsuariosTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        <div className="px-4 pb-4 flex justify-between">
          <button className="btn-light">Historial</button>
          <button className="btn-dark">+ Agregar nuevo usuario</button>
        </div>
      </section>

      {showForm && (
        <UsuarioForm
          title={`Registrar ${tab === "RESPONSABLE" ? "Responsable" : "Evaluador"}`}
          areas={areas}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </AdminLayout>
  );
}
