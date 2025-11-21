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
  fetchCoordinadores,
  createCoordinador,
  updateCoordinador,
  deleteCoordinador,
} from "../api/coordinador.js";

export default function AdminUsuarios() {
  // pestaña activa del módulo usuarios (RESPONSABLE | COORDINADOR)
  const [tab, setTab] = useState("RESPONSABLE");

  // ÁREAS (por ahora mock, idealmente vendrá de /api/areas)
  const [areas] = useState([
    { id: 1, nombre: "General" },
    { id: 2, nombre: "Matematica" },
    { id: 3, nombre: "Fisica" },
    { id: 4, nombre: "Quimica" },
    { id: 5, nombre: "Biologia" },
    { id: 6, nombre: "Robotica" },
    { id: 7, nombre: "Informatica" },
  ]);

  // MEDALLAS (persistencia local en localStorage)
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

  // ESTADO DEL PROCESO
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
 const [coordinadores, setCoordinadores] = useState([]);

  // MODAL
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [selected, setSelected] = useState(null);

  // cargar data del backend cuando cambia el tab
  useEffect(() => {
    async function cargar() {
      if (tab === "RESPONSABLE") {
       const data = await fetchResponsables();
        setResponsables(data);
      } else if (tab === "COORDINADOR") {
      const dataCoord = await fetchCoordinadores();
      setCoordinadores(dataCoord);   
      }
    }
    cargar();
  }, [tab]);

  // Guardar (create/update)
  const handleSave = async (formDelModal) => {
  try {
    if (tab === "RESPONSABLE") {
      // ... esta parte la dejas tal como ya la tienes ...
    } else if (tab === "COORDINADOR") {
      console.log("🟢 Form recibido del modal (COORDINADOR):", formDelModal);

      if (mode === "edit" && selected) {
        const updatedCoord = await updateCoordinador(
          selected.id,
          formDelModal
        );
        setCoordinadores((prev) =>
          prev.map((x) => (x.id === selected.id ? updatedCoord : x))
        );
      } else {
        const createdCoord = await createCoordinador(formDelModal);
        setCoordinadores((prev) => [...prev, createdCoord]);
      }
    }

    setShowForm(false);
    setSelected(null);
  } catch (e) {
    console.error("Error al guardar:", e);
    alert("No se pudo guardar. Revisa la consola para más detalles.");
  }
};


  // lista actual según pestaña
  const rows = tab === "RESPONSABLE" ? responsables : coordinadores;

  // eliminar
  const handleDelete = async (row) => {
  const id = row?.id;
  if (!id) return;

  try {
    if (tab === "RESPONSABLE") {
      await deleteResponsable(id);
      setResponsables((prev) => prev.filter((x) => x.id !== id));
    } else if (tab === "COORDINADOR") {
      await deleteCoordinador(id);
      setCoordinadores((prev) => prev.filter((x) => x.id !== id));
    }

    if (selected && selected.id === id) {
      setShowForm(false);
      setSelected(null);
    }
  } catch (e) {
    console.error("Error al eliminar:", e);
    alert("No se pudo eliminar el registro.");
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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Dashboard</span>
        <span className="text-xl font-bold text-gray-800 tracking-wide"> ADMINISTRADOR</span>

        <span className="text-xs text-gray-500">
          Gestión actual: <b>2025</b>
        </span>
      </div>

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
            { key: "COORDINADOR", label: "Tabla de Coordinadores" },
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
