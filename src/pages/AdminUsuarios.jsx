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
  // pestaña activa del módulo usuarios (RESPONSABLE | EVALUADOR)
  const [tab, setTab] = useState("RESPONSABLE");

  // ÁREAS (por ahora mock, idealmente vendrá de /api/areas)
  const [areas] = useState([
    { id: 1, nombre: "Sistemas" },
    { id: 2, nombre: "Industrial" },
    { id: 3, nombre: "Civil" },
  ]);

  // MEDALLAS (persistencia local en localStorage)
  const STORAGE_KEY = "ohsansi_parametros_medallero";
  const [medallas, setMedallas] = useState({ oro: 0, plata: 0, bronce: 0 });
  const [guardado, setGuardado] = useState(false);

  // Al montar, intenta cargar medallas guardadas en localStorage
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
        /* noop: si falla el parse, ignora y deja valores por defecto */
      }
    }
  }, []);

  // Handler para cambiar un campo de medallas (oro/plata/bronce)
  const onChangeMedalla = (campo) => (e) => {
    const val = Math.max(0, Number(e.target.value || 0));
    setMedallas((prev) => ({ ...prev, [campo]: val }));
    setGuardado(false); // marca como no guardado hasta que el usuario confirme
  };

  // Guarda medallas en localStorage
  const guardarMedallas = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medallas));
    setGuardado(true);
  };

  // Restablece medallas y limpia localStorage
  const resetMedallas = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMedallas({ oro: 0, plata: 0, bronce: 0 });
    setGuardado(false);
  };

  // ESTADO DEL PROCESO (UI local) con persistencia
  const PROCESS_KEY = "ohsansi_estado_proceso";
  const [proceso, setProceso] = useState({ en: false, fin: false }); // switches del estado
  const [dirtyProceso, setDirtyProceso] = useState(false); // si hay cambios sin guardar
  const [savedProceso, setSavedProceso] = useState(false); // si se guardó recientemente
  const lastSavedProceso = useRef({ en: false, fin: false }); // cache del último guardado

  // Marcar cambios de proceso y habilitar botón Guardar si hay diferencias
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

  // Persistir el estado del proceso en localStorage
  const guardarProceso = () => {
    localStorage.setItem(PROCESS_KEY, JSON.stringify(proceso));
    lastSavedProceso.current = { ...proceso };
    setDirtyProceso(false);
    setSavedProceso(true);
  };

  // LISTAS DESDE BACKEND (estado de data de cada tab)
  const [responsables, setResponsables] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);

  // MODAL USUARIO (control de apertura, modo y fila seleccionada)
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [selected, setSelected] = useState(null);

  // 1) cargar data del backend cuando cambia el tab
  useEffect(() => {
    async function cargar() {
      if (tab === "RESPONSABLE") {
        const data = await fetchResponsables(); // ya mapeado en la API
        setResponsables(data);
      } else if (tab === "EVALUADOR") {
        const dataEval = await fetchEvaluadores(); // GET /api/evaluadores
        setEvaluadores(dataEval);
      }
    }
    cargar();
  }, [tab]);

  // ✅ Adaptadores de forma UI ↔ Back (RESPONSABLE)
  // (Opcional) Útiles si tu API espera otros nombres de campos
  const mapUIToBackResponsable = (f) => ({
    nombres_evaluador: f.nombres,
    apellidos: f.apellidos,
    correo_electronico: f.correo,
    usuario_responsable: `${(f.nombres?.[0] || "").toUpperCase()}${(f.apellidos?.[0] || "").toUpperCase()}`,
    pass_responsable: "123456",          // o usa f.ci si lo tienes en el form
    id_area: Number(f.areaId),
  });

  const mapBackToUIResponsable = (r) => ({
    id: r.id ?? r.id_responsable,
    nombres: r.nombres ?? r.nombres_evaluador,
    apellidos: r.apellidos ?? "",
    rol: "RESPONSABLE",
    // area puede venir como string u objeto {id_area, nombre_area}
    area: r.area?.nombre_area ?? r.area ?? "",
    estado: true,
    correo: r.correo ?? r.correo_electronico ?? "",
  });

  // ✅ Guardar (create/update) usando el form que llega del modal
  const handleSave = async (formDelModal) => {
    try {
      if (tab === "RESPONSABLE") {
        console.log("🟡 Form recibido del modal:", formDelModal);

        if (mode === "edit" && selected) {
          // Actualiza registro existente en backend
          const updated = await updateResponsable(selected.id, formDelModal);
          // Reemplaza en estado local la fila actualizada
          setResponsables((prev) => prev.map((x) => (x.id === selected.id ? ui : x)));
        } else {
          // Crea nuevo registro en backend
          const created = await createResponsable(formDelModal);
          // Agrega al final de la lista local
          setResponsables((prev) => [...prev, created]);
        }
      } else {
        // EVALUADOR (payload mínimo; ajusta si ya tienes mapeo para evaluador)
        const payloadEval = {
          nombres: formDelModal.nombres,
          apellidos: formDelModal.apellidos,
          id_area: Number(formDelModal.areaId),
        };

        if (mode === "edit" && selected) {
          const updatedEval = await updateEvaluador(selected.id, payloadEval);
          setEvaluadores((prev) => prev.map((x) => (x.id === selected.id ? updatedEval : x)));
        } else {
          const createdEval = await createEvaluador(payloadEval);
          setEvaluadores((prev) => [...prev, createdEval]);
        }
      }

      // Cierra modal y limpia selección
      setShowForm(false);
      setSelected(null);
    } catch (e) {
      console.error("Error al guardar:", e);
      alert("No se pudo guardar. Revisa la consola para más detalles.");
    }
  };

  // 2) cuál lista mostrar (depende de la pestaña elegida)
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

    // Si estabas editando justo ese registro, cierra el modal
    if (selected && selected.id === id) {
      setShowForm(false);
      setSelected(null);
    }
  };

  // 4) editar: abre modal, cambia modo y carga la fila seleccionada
  const handleEdit = (row) => {
    setSelected(row);
    setMode("edit");
    setShowForm(true);
  };

  // 5) crear: abre modal en modo creación y sin selección previa
  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  // RENDER principal
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Dashboard</span>
        <span className="text-xs text-gray-500">
          Gestión actual: <b>2025</b>
        </span>
      </div>
      {/* KPIs y estado */}
      <section className="space-y-4">

        {/* KPI: número de usuarios (depende de la pestaña activa) */}
        <div className="panel">
          <label className="section">Número de Usuarios Registrados</label>
          <input disabled value={rows.length} className="kpi-input w-40" />
        </div>

        {/* Panel de configuración de medallas con persistencia local */}
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

            {/* Acciones de guardar/restablecer y estado de guardado */}
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

        {/* Panel del estado del proceso con switches y persistencia */}
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
        {/* Selector de pestañas para alternar entre Responsables y Evaluadores */}
        <UsuariosTabs
          tabs={[
            { key: "RESPONSABLE", label: "Tabla de Responsables de área" },
            { key: "EVALUADOR", label: "Tabla de Evaluadores" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {/* Tabla con filas provenientes del backend (según pestaña) */}
        <div className="p-4">
          <UsuariosTable
            rows={rows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Acciones inferiores: historial y crear nuevo */}
        <div className="px-4 pb-4 flex justify-between">
          <button className="btn-light">Historial</button>
          <button className="btn-dark" onClick={handleCreate}>
            + Agregar nuevo usuario
          </button>
        </div>
      </section>

      {/* Modal del formulario de Usuario (creación/edición) */}
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

