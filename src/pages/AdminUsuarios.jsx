import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";
import AreasModal from "../components/AreasModal.jsx";
import Swal from 'sweetalert2';
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

  // ÁREAS (solo frontend, editable desde el modal)
  const [areas, setAreas] = useState([
    { id: 1, nombre: "General" },
    { id: 2, nombre: "Matematica" },
    { id: 3, nombre: "Fisica" },
    { id: 4, nombre: "Quimica" },
    { id: 5, nombre: "Biologia" },
    { id: 6, nombre: "Robotica" },
    { id: 7, nombre: "Informatica" },
  ]);
  const [showAreasModal, setShowAreasModal] = useState(false);

  // ============================================================
  // MEDALLAS POR ÁREA (localStorage)
  // ============================================================
  const STORAGE_MEDALLAS_AREA = "ohsansi_medallas_por_area";
  // estructura: { [id_area]: { oro, plata, bronce } }
  const [medallasArea, setMedallasArea] = useState({});
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [guardadoArea, setGuardadoArea] = useState(false);

  // cargar medallas por área al inicio
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_MEDALLAS_AREA);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setMedallasArea(parsed || {});
      } catch {
        /* noop */
      }
    }
  }, []);

  // seleccionar un área por defecto (la primera) si aún no hay
  useEffect(() => {
    if (!areaSeleccionada && areas.length > 0) {
      setAreaSeleccionada(areas[0].id);
    }
  }, [areas, areaSeleccionada]);

  const handleSelectArea = (e) => {
    setAreaSeleccionada(Number(e.target.value));
    setGuardadoArea(false);
  };

  const onChangeMedallaArea = (campo) => (e) => {
    const val = Math.max(0, Number(e.target.value || 0));
    setMedallasArea((prev) => {
      const id = areaSeleccionada;
      if (!id) return prev;
      const actual = prev[id] || { oro: 0, plata: 0, bronce: 0 };
      return {
        ...prev,
        [id]: { ...actual, [campo]: val },
      };
    });
    setGuardadoArea(false);
  };

  const guardarMedallasArea = () => {
    localStorage.setItem(STORAGE_MEDALLAS_AREA, JSON.stringify(medallasArea));
    setGuardadoArea(true);
  };

  const resetMedallasArea = () => {
    if (!areaSeleccionada) return;
    setMedallasArea((prev) => {
      const copia = { ...prev };
      delete copia[areaSeleccionada];
      return copia;
    });
    setGuardadoArea(false);
  };

  // ============================================================
  // ESTADO DEL PROCESO
  // ============================================================
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

  // ============================================================
  // LISTAS DESDE BACKEND
  // ============================================================
  const [responsables, setResponsables] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);

  // MODAL usuario
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

 // guardar (crear / editar)
const handleSave = async (form) => {
  try {
    if (isEditing) {
      // editar responsable
      if (tab === "RESPONSABLE") {
        await updateResponsable(editingId, form);
        // aquí podrías recargar desde el back o actualizar el estado local
        await cargarResponsables?.(); // si tienes esta función
      } else if (tab === "COORDINADOR") {
        await updateCoordinador(editingId, form);
        await cargarCoordinadores?.();
      }

      await Swal.fire({
        title: 'Actualizado',
        text: 'Los datos se guardaron correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

    } else {
      // crear responsable / coordinador
      if (tab === "RESPONSABLE") {
        await createResponsable(form);
        await cargarResponsables?.();
      } else if (tab === "COORDINADOR") {
        await createCoordinador(form);
        await cargarCoordinadores?.();
      }

      await Swal.fire({
        title: 'Creado',
        text: 'El registro fue creado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }

    // cerrar formulario / limpiar selección
    setShowForm(false);
    setSelected(null);
    // setIsEditing(false); // si tienes este estado

  } catch (e) {
    console.error("Error al guardar:", e);
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al guardar el registro.',
      icon: 'error',
    });
  }
};

  // lista actual según pestaña
  const rows = tab === "RESPONSABLE" ? responsables : coordinadores;

  // eliminar
 // eliminar
const handleDelete = async (row) => {
  const id = row?.id;
  if (!id) return;

  try {
    // Confirmación
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // el usuario canceló
    }

    //  Eliminar según la pestaña
    if (tab === "RESPONSABLE") {
      await deleteResponsable(id);
      setResponsables((prev) => prev.filter((x) => x.id !== id));

      await Swal.fire({
        title: 'Eliminado',
        text: 'El responsable fue eliminado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

    } else if (tab === "COORDINADOR") {
      await deleteCoordinador(id);
      setCoordinadores((prev) => prev.filter((x) => x.id !== id));

      await Swal.fire({
        title: 'Eliminado',
        text: 'El coordinador fue eliminado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }

    // limpiar formulario si estaba seleccionado
    if (selected && selected.id === id) {
      setShowForm(false);
      setSelected(null);
    }

  } catch (e) {
    console.error("Error al eliminar:", e);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar el registro.',
      icon: 'error',
    });
  }
};

const handleEdit = (row) => {
  if (!row) {
    return Swal.fire({
      title: "Error",
      text: "No se seleccionó ningún registro para editar.",
      icon: "error",
    });
  }

  Swal.fire({
    title: "Modo edición",
    text: `Estás editando a ${row.nombres} ${row.apellidos}`,
    icon: "info",
    timer: 1200,
    showConfirmButton: false,
  });

  setSelected(row);
  setMode("edit");
  setShowForm(true);
};

  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  // ---- Handlers para ÁREAS (solo UI, sin backend) ----
  const handleCreateArea = (nombre) => {
    setAreas((prev) => {
      const nextId = (prev[prev.length - 1]?.id || 0) + 1;
      return [...prev, { id: nextId, nombre }];
    });
  };

  const handleUpdateArea = (id, nombre) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, nombre } : a)));
  };

  const handleDeleteArea = (id) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Dashboard</span>
        <span className="text-lg font-bold text-gray-800">
          ADMINISTRADOR
        </span>
        <span className="text-xs text-gray-500">
          Gestión actual: <b>2025</b>
        </span>
      </div>

      {/* KPIs y estado */}
      <section className="space-y-4">
        {/* Número de usuarios + botón áreas */}
        <div className="panel flex items-center gap-4">
          <div>
            <label className="section">Número de Usuarios Registrados</label>
            <input disabled value={rows.length} className="kpi-input w-40" />
          </div>

          <div className="ml-auto">
            <button
              className="btn-light"
              onClick={() => setShowAreasModal(true)}
            >
              Gestionar áreas
            </button>
          </div>
        </div>

        {/* Medallas POR ÁREA */}
        <div className="panel">
          <p className="section">Relación de Medallas por Área</p>

          <div className="flex flex-wrap items-center gap-4">
            {/* selector de área */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Área:</span>
              <select
                value={areaSeleccionada ?? ""}
                onChange={handleSelectArea}
                className="kpi-input min-w-[160px]"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* inputs oro/plata/bronce para el área seleccionada */}
            {(() => {
              const m =
                medallasArea[areaSeleccionada] || {
                  oro: 0,
                  plata: 0,
                  bronce: 0,
                };

              return (
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 w-14">Oro:</span>
                    <input
                      type="number"
                      min={0}
                      value={m.oro}
                      onChange={onChangeMedallaArea("oro")}
                      className="kpi-input w-20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 w-14">Plata:</span>
                    <input
                      type="number"
                      min={0}
                      value={m.plata}
                      onChange={onChangeMedallaArea("plata")}
                      className="kpi-input w-20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 w-14">Bronce:</span>
                    <input
                      type="number"
                      min={0}
                      value={m.bronce}
                      onChange={onChangeMedallaArea("bronce")}
                      className="kpi-input w-20"
                    />
                  </div>

                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={guardarMedallasArea}
                      className="btn-dark px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm"
                    >
                      Guardar por área
                    </button>
                    <button
                      type="button"
                      onClick={resetMedallasArea}
                      className="btn-light px-4 py-2 rounded-xl text-sm"
                    >
                      Restablecer área
                    </button>
                    {guardadoArea && (
                      <span className="text-green-600 text-sm">
                        ✓ Guardado
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Estado del proceso */}
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

      {showAreasModal && (
        <AreasModal
          areas={areas}
          onClose={() => setShowAreasModal(false)}
          onCreate={handleCreateArea}
          onUpdate={handleUpdateArea}
          onDelete={handleDeleteArea}
        />
      )}
    </AdminLayout>
  );
}
