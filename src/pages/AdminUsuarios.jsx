import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";

import {
  fetchResponsables,
  createResponsable,
  updateResponsable,
  deleteResponsable,
} from "../api/responsables.js";

import {
  fetchEvaluadores,
  createEvaluador,
  updateEvaluador,
  deleteEvaluador,
} from "../api/evaluadores.js";

export default function AdminUsuarios() {
  const [tab, setTab] = useState("RESPONSABLE");

  // ÁREAS (por ahora mock, idealmente vendrá de /api/areas)
  const [areas] = useState([
    { id: 1, nombre: "Sistemas" },
    { id: 2, nombre: "Industrial" },
    { id: 3, nombre: "Civil" },
  ]);

  // MEDALLAS (localStorage)
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

  // ESTADO DEL PROCESO (UI local)
  const PROCESS_KEY = "ohsansi_estado_proceso";
  const [proceso, setProceso] = useState({ en: false, fin: false });
  const [dirtyProceso, setDirtyProceso] = useState(false);
  const [savedProceso, setSavedProceso] = useState(false);
  const lastSavedProceso = useRef({ en: false, fin: false });

  const onChangeProceso = (campo) => (e) => {
    const value = e.target.checked;
    const nuevo = { ...proceso, [campo]: value };
    setProceso(nuevo);

    const isDifferent =
      nuevo.en !== lastSavedProceso.current.en ||
      nuevo.fin !== lastSavedProceso.current.fin;

    setDirtyProceso(isDifferent);
    setSavedProceso(false);
  };

  const guardarProceso = () => {
    localStorage.setItem(PROCESS_KEY, JSON.stringify(proceso));
    lastSavedProceso.current = { ...proceso };
    setDirtyProceso(false);
    setSavedProceso(true);
  };

  // LISTAS DESDE BACKEND
  const [responsables, setResponsables] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);

  // MODAL USUARIO
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [selected, setSelected] = useState(null);

  // 1) cargar data del backend cuando cambia el tab
  useEffect(() => {
    async function cargar() {
      if (tab === "RESPONSABLE") {
        const data = await fetchResponsables(); // GET /api/responsables
        setResponsables(data);
      } else if (tab === "EVALUADOR") {
        const dataEval = await fetchEvaluadores(); // GET /api/evaluadores
        setEvaluadores(dataEval);
      }
    }

    cargar();
  }, [tab]);

  // 2) cuál lista mostrar
  const rows = tab === "RESPONSABLE" ? responsables : evaluadores;

  // 3) eliminar
  const handleDelete = async (row) => {
    const id = row?.id;
    if (!id) return;

    if (tab === "RESPONSABLE") {
      await deleteResponsable(id); // DELETE /api/responsables/:id
      setResponsables((prev) => prev.filter((x) => x.id !== id));
    } else {
      await deleteEvaluador(id); // DELETE /api/evaluadores/:id
      setEvaluadores((prev) => prev.filter((x) => x.id !== id));
    }

    if (selected && selected.id === id) {
      setShowForm(false);
      setSelected(null);
    }
  };

  // 4) editar
  const handleEdit = (row) => {
    setSelected(row);
    setMode("edit");
    setShowForm(true);
  };

  // 5) crear
  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  // 6) guardar (create o update)
  const handleSave = async (dataFormDelModal) => {
    // dataFormDelModal viene de UsuarioForm
    // {
    //   nombres, apellidos, rol, areaId, area, correo, telefono, activo
    // }

    const payloadResponsable = {
      nombres: dataFormDelModal.nombres,
      apellidos: dataFormDelModal.apellidos,
      correo: dataFormDelModal.correo,
      usuario:
        ((dataFormDelModal.nombres?.[0] || "") +
          (dataFormDelModal.apellidos?.[0] || "")).toUpperCase(),
      id_area: dataFormDelModal.areaId,
      password: "123456",
    };

    const payloadEvaluador = {
      nombres: dataFormDelModal.nombres,
      apellidos: dataFormDelModal.apellidos,
      id_area: dataFormDelModal.areaId,
    };

    if (tab === "RESPONSABLE") {
      if (mode === "edit" && selected) {
        const updated = await updateResponsable(selected.id, payloadResponsable);
        setResponsables((prev) =>
          prev.map((x) => (x.id === selected.id ? updated : x))
        );
      } else {
        const nuevo = await createResponsable(payloadResponsable);
        setResponsables((prev) => [...prev, nuevo]);
      }
    } else {
      if (mode === "edit" && selected) {
        const updatedEval = await updateEvaluador(
          selected.id,
          payloadEvaluador
        );
        setEvaluadores((prev) =>
          prev.map((x) => (x.id === selected.id ? updatedEval : x))
        );
      } else {
        const nuevoEval = await createEvaluador(payloadEvaluador);
        setEvaluadores((prev) => [...prev, nuevoEval]);
      }
    }

    setShowForm(false);
    setSelected(null);
  };

  // RENDER
  return (
    <AdminLayout>
      <div className="text-sm text-gray-600 mb-2">Dashboard</div>

      {/* KPIs y estado */}
      <section className="space-y-4">
        <div className="panel">
          <label className="section">Número de Usuarios Registrados</label>
          <input disabled value={rows.length} className="kpi-input w-40" />
        </div>

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

      {/* Tabla de usuarios */}
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
          defaultRol={tab} // esto rellena el <select Rol> en el modal
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
