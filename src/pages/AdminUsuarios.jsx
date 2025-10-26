import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";

export default function AdminUsuarios() {
  const [tab, setTab] = useState("RESPONSABLE");
  const [rows, setRows] = useState([]);

  const [areas] = useState([
    { id: 1, nombre: "Sistemas" },
    { id: 2, nombre: "Industrial" },
    { id: 3, nombre: "Civil" },
  ]);

  // -------- NUEVO BLOQUE PARA MEDALLERO --------
  const STORAGE_KEY = "ohsansi_parametros_medallero";
  const [medallas, setMedallas] = useState({ oro: 0, plata: 0, bronce: 0 });
  const [guardado, setGuardado] = useState(false);

  // cargar valores guardados
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setMedallas({
          oro: Number(parsed.oro) || 0,
          plata: Number(parsed.plata) || 0,
          bronce: Number(parsed.bronce) || 0,
        });
      } catch {
        // ignora si no hay datos válidos
      }
    }
  }, []);

  const onChangeMedalla = (campo) => (e) => {
    const val = Math.max(0, Number(e.target.value || 0));
    setMedallas((prev) => ({ ...prev, [campo]: val }));
    setGuardado(false);
  };

  const guardarMedallas = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medallas));
    setGuardado(true);
  };

  const resetMedallas = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMedallas({ oro: 0, plata: 0, bronce: 0 });
    setGuardado(false);
  };
  // ---------------------------------------------

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [selected, setSelected] = useState(null);

  // datos demo por pestaña
  useEffect(() => {
    if (tab === "RESPONSABLE") {
      setRows([
        {
          id: 1,
          nombres: "María",
          apellidos: "Pérez",
          rol: "RESPONSABLE",
          area: "Sistemas",
          estado: true,
          correo: "maria@umss.edu",
          telefono: "70000001",
          nombreUsuario: "MP",
        },
      ]);
    } else {
      setRows([
        {
          id: 2,
          nombres: "Carlos",
          apellidos: "Rojas",
          rol: "EVALUADOR",
          area: "Industrial",
          estado: true,
          correo: "carlos@umss.edu",
          telefono: "70000002",
          nombreUsuario: "CR",
        },
      ]);
    }
  }, [tab]);

  const handleDelete = (id) => setRows((r) => r.filter((x) => x.id !== id));

  const handleEdit = (row) => {
    setSelected(row);
    setMode("edit");
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  const handleSave = (data) => {
    const areaNombre =
      data.area ??
      areas.find((a) => a.id === Number(data.areaId))?.nombre ??
      "Sistemas";

    const iniciales = `${(data.nombres || "").charAt(0)}${(data.apellidos || "").charAt(0)}`.toUpperCase();

    if (mode === "edit" && selected) {
      setRows((prev) =>
        prev.map((x) =>
          x.id === selected.id
            ? {
                ...x,
                ...data,
                area: areaNombre,
                rol: data.rol ?? x.rol,
                estado: data.activo ?? data.estado ?? true,
                nombreUsuario: iniciales,
              }
            : x
        )
      );
    } else {
      const nextId = Math.max(0, ...rows.map((x) => x.id)) + 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          rol: data.rol ?? tab,
          nombres: data.nombres,
          apellidos: data.apellidos,
          correo: data.correo,
          telefono: data.telefono,
          estado: data.activo ?? true,
          area: areaNombre,
          nombreUsuario: iniciales,
        },
      ]);
    }

    setShowForm(false);
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="text-sm text-gray-600 mb-2">Dashboard</div>

      <section className="space-y-4">
        <div className="panel">
          <label className="section">Numeros de Usuarios Registrados</label>
          <input disabled value={rows.length} className="kpi-input w-40" />
        </div>

        {/* ======= PANEL DE MEDALLAS EDITABLE ======= */}
        <div className="panel">
          <p className="section">Cantidad de Medallas:</p>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              ["Oro", "oro"],
              ["Plata", "plata"],
              ["Bronce", "bronce"],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-gray-700 w-14">{label}:</span>
                <input
                  type="number"
                  min={0}
                  value={medallas[key]}
                  onChange={onChangeMedalla(key)}
                  className="kpi-input"
                />
              </div>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <button onClick={guardarMedallas} className="btn-dark">
                Guardar Cambios
              </button>
              <button onClick={resetMedallas} className="btn-light">
                Restablecer
              </button>
              {guardado && (
                <span className="text-green-600 text-sm">✓ Guardado</span>
              )}
            </div>
          </div>
        </div>
        {/* =========================================== */}

        <div className="panel">
          <span className="section">Estado del proceso:</span>
          <div className="flex items-center gap-8">
            <label className="inline-flex items-center gap-2 text-gray-800">
              <input
                type="checkbox"
                defaultChecked
                className="accent-gray-700"
              />{" "}
              En evaluación
            </label>
            <label className="inline-flex items-center gap-2 text-gray-800">
              <input type="checkbox" className="accent-gray-700" /> Concluido
            </label>
          </div>
        </div>
      </section>

      {/* tabs + tabla */}
      <section className="mt-4 card">
        <UsuariosTabs
          tabs={[
            { key: "RESPONSABLE", label: "Tabla de Responsables de área" },
            { key: "EVALUADOR", label: "Tabla de Evaluadores" },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="p-4">
          <UsuariosTable
            rows={rows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="px-4 pb-4 flex justify-between">
          <button className="btn-light">Historial</button>
          <button className="btn-dark" onClick={handleCreate}>
            + Agregar nuevo usuario
          </button>
        </div>
      </section>

      {showForm && (
        <UsuarioForm
          key={mode + (selected?.id ?? "nuevo")}
          mode={mode}
          title={mode === "edit" ? "Editar Usuario" : "Registro de Usuario"}
          areas={areas}
          initialData={selected}
          defaultRol={tab}
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelected(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

