import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";

export default function AdminUsuarios() {
  const [tab, setTab] = useState("RESPONSABLE");

  // ================= ÁREAS DISPONIBLES =================
  const [areas] = useState([
    { id: 1, nombre: "Sistemas" },
    { id: 2, nombre: "Industrial" },
    { id: 3, nombre: "Civil" },
  ]);

  // ================= MEDALLERO =================
  const STORAGE_KEY = "ohsansi_parametros_medallero";
  const [medallas, setMedallas] = useState({ oro: 0, plata: 0, bronce: 0 });
  const [guardado, setGuardado] = useState(false);

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
        /* noop */
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

  // ============ ESTADO DEL PROCESO ============

  const PROCESS_KEY = "ohsansi_estado_proceso";
  const [proceso, setProceso] = useState({ en: false, fin: false }); // ambos sin marcar
  const [dirtyProceso, setDirtyProceso] = useState(false);
  const [savedProceso, setSavedProceso] = useState(false);

  // 🔹 Guardamos referencia al último guardado
  const lastSavedProceso = useRef({ en: false, fin: false });

  const onChangeProceso = (campo) => (e) => {
    const value = e.target.checked;
    const nuevo = { ...proceso, [campo]: value };
    setProceso(nuevo);

    // Comparamos con el último guardado
    const isDifferent =
      nuevo.en !== lastSavedProceso.current.en ||
      nuevo.fin !== lastSavedProceso.current.fin;

    setDirtyProceso(isDifferent);
    setSavedProceso(false);
  };

  const guardarProceso = () => {
    localStorage.setItem(PROCESS_KEY, JSON.stringify(proceso));
    // Actualizamos la referencia con el nuevo valor guardado
    lastSavedProceso.current = { ...proceso };
    setDirtyProceso(false);
    setSavedProceso(true);
  };

  // ================= MODAL / CRUD =================
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);

  const [responsables, setResponsables] = useState([
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

  const [evaluadores, setEvaluadores] = useState([
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

  const rows = tab === "RESPONSABLE" ? responsables : evaluadores;
  const handleDelete = (arg) => {
    const raw = typeof arg === "object" && arg !== null ? arg.id : arg;
    if (raw == null) return;
    const norm = (v) => (isNaN(Number(v)) ? String(v) : Number(v));
    const id = norm(raw);
    const removeById = (arr) => arr.filter((x) => norm(x.id) !== id);

    if (tab === "RESPONSABLE") {
      setResponsables((prev) => removeById(prev));
    } else {
      setEvaluadores((prev) => removeById(prev));
    }

    if (selected && norm(selected.id) === id) {
      setShowForm(false);
      setSelected(null);
    }
  };

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

    const newUser = {
      id: selected?.id ?? Date.now(),
      rol: data.rol ?? tab,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      estado: data.activo ?? true,
      area: areaNombre,
      nombreUsuario: iniciales,
    };

    if (tab === "RESPONSABLE") {
      setResponsables((prev) => {
        if (mode === "edit" && selected) {
          return prev.map((x) => (x.id === selected.id ? newUser : x));
        }
        return [...prev, newUser];
      });
    } else {
      setEvaluadores((prev) => {
        if (mode === "edit" && selected) {
          return prev.map((x) => (x.id === selected.id ? newUser : x));
        }
        return [...prev, newUser];
      });
    }

    setShowForm(false);
    setSelected(null);
  };

  // ================= RENDER =================
  return (
    <AdminLayout>
      <div className="text-sm text-gray-600 mb-2">Dashboard</div>

      {/* Tarjetas superiores */}
      <section className="space-y-4">
        <div className="panel">
          <label className="section">Número de Usuarios Registrados</label>
          <input disabled value={rows.length} className="kpi-input w-40" />
        </div>

        {/* ======= PANEL DE MEDALLAS ======= */}
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

        {/* ======= ESTADO DEL PROCESO ======= */}
        <div className="panel bg-gray-100">
          <div className="flex items-center gap-8 flex-wrap">
            <span className="section">Estado del proceso:</span>

            <label className="inline-flex items-center gap-2 text-gray-800 text-sm">
              <span>En evaluación</span>
              <input
                type="checkbox"
                className="accent-gray-700"
                checked={proceso.en}
                onChange={onChangeProceso("en")}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-gray-800 text-sm">
              <span>Concluido</span>
              <input
                type="checkbox"
                className="accent-gray-700"
                checked={proceso.fin}
                onChange={onChangeProceso("fin")}
              />
            </label>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={guardarProceso}
                disabled={!dirtyProceso}
                className={`btn-dark ${
                  !dirtyProceso ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                Guardar Cambios
              </button>

              {savedProceso && (
                <span className="text-green-600 text-sm whitespace-nowrap">
                  ✓ Guardado
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabla principal */}
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
