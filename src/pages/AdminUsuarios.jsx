import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import UsuariosTabs from "../components/UsuariosTabs.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import UsuarioForm from "../components/UsuarioForm.jsx";
import AreasModal from "../components/AreasModal.jsx";
import MedallasModal from "../components/MedallasModal.jsx";
import Swal from "sweetalert2";

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

import {
  fetchAreas,
  createArea as apiCreateArea,
  updateArea as apiUpdateArea,
  deleteArea as apiDeleteArea,
} from "../api/area.js";

// 🔹 NUEVO: API para parámetro de clasificación (tabla fases)
import {
  fetchParametroClasificacion,
  updateParametroClasificacion,
  eliminarClasificadosPorNotaMinima,
} from "../api/fases.js";

export default function AdminUsuarios() {
  // pestaña activa del módulo usuarios (RESPONSABLE | COORDINADOR)
  const [tab, setTab] = useState("RESPONSABLE");

  // ÁREAS (ahora vienen de la BD, pero las guardamos como { id, nombre } para no romper nada)
  const [areas, setAreas] = useState([]);

  const [showAreasModal, setShowAreasModal] = useState(false);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const data = await fetchAreas(); // viene [{ id_area, nombre_area, ... }]
        const adaptadas = data.map((a) => ({
          id: Number(a.id_area),
          nombre: a.nombre_area,
        }));
        setAreas(adaptadas);
      } catch (e) {
        console.error("Error cargando áreas:", e);
      }
    };
    cargarAreas();
  }, []);

  // ============================================================
  // MEDALLAS POR ÁREA (localStorage)
  // ============================================================
  const STORAGE_MEDALLAS_AREA = "ohsansi_medallas_por_area";
  // estructura: { [id_area]: { cantidades:{oro,plata,bronce}, puntajes:{oro,plata,bronce} } }
  const [medallasArea, setMedallasArea] = useState({});
  const [showMedallasModal, setShowMedallasModal] = useState(false);

  // área seleccionada para la VISUALIZACIÓN del panel "Relación de Medallas por Área"
  const [areaVistaId, setAreaVistaId] = useState(null);

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

  // si aún no hay área seleccionada para la vista, tomar la primera disponible
  useEffect(() => {
    if (!areaVistaId && areas.length > 0) {
      setAreaVistaId(areas[0].id);
    }
  }, [areas, areaVistaId]);

  const handleSaveMedallasArea = (nuevoObjeto) => {
    setMedallasArea(nuevoObjeto);
    localStorage.setItem(STORAGE_MEDALLAS_AREA, JSON.stringify(nuevoObjeto));
    setShowMedallasModal(false);
  };

  // ============================================================
  // PARÁMETRO: Nota mínima de clasificación (BD -> tabla fases)
  // ============================================================
  const [notaMinima, setNotaMinima] = useState(50);
  const [notaGuardada, setNotaGuardada] = useState(false);
  const [notaDirty, setNotaDirty] = useState(false);
  const [notaError, setNotaError] = useState("");

  // cargar la nota mínima guardada en BD (si existe)
  useEffect(() => {
    async function cargarNotaMinima() {
      try {
        const data = await fetchParametroClasificacion();
        if (data?.nota_minima != null) {
          setNotaMinima(Number(data.nota_minima));
        }
      } catch (e) {
        console.error("Error cargando nota mínima desde BD:", e);
        // si falla, dejamos el valor por defecto (50)
      }
    }
    cargarNotaMinima();
  }, []);

  const handleChangeNotaMinima = (e) => {
    const v = Number(e.target.value);

    if (Number.isNaN(v)) {
      setNotaMinima(0);
      setNotaError("Ingresa un número válido.");
      setNotaDirty(false);
      setNotaGuardada(false);
      return;
    }

    setNotaMinima(v);
    setNotaGuardada(false);
    setNotaDirty(true);

    if (v <= 0) {
      setNotaError("La nota mínima debe ser mayor que 0.");
    } else if (v > 100) {
      setNotaError("La nota mínima no puede ser mayor que 100.");
    } else {
      setNotaError("");
    }
  };

  const guardarNotaMinima = async () => {
    if (notaMinima <= 0 || notaMinima > 100) {
      setNotaError("La nota mínima debe estar entre 1 y 100.");
      return;
    }

    try {
      await updateParametroClasificacion(notaMinima);
      
      // Traer clasificados y evaluaciones
      const resClasificados =  await fetch(`${import.meta.env.VITE_API_URL}/clasificados`);
      const { data: clasificados } = await resClasificados.json();

      const resEvaluaciones = await fetch(`${import.meta.env.VITE_API_URL}/evaluaciones`);
      const { data: evaluaciones } = await resEvaluaciones.json();
        
      // Filtrar ids_inscritos con nota menor
      const idsInscritosBajoNota = evaluaciones
        .filter(ev => Number(ev.nota) < notaMinima && ev.nota !== "")
        .map(ev => Number(ev.id_inscrito));

      // Filtrar ids_clasificado a eliminar
      const idsAEliminar = clasificados
        .filter(c => idsInscritosBajoNota.includes(Number(c.id_inscrito)))
        .map(c => Number(c.id_clasificado));

      // Eliminar si hay algo
      if (idsAEliminar.length > 0) {
        await eliminarClasificadosPorNotaMinima(idsAEliminar);
      }

      // Vaciar array
      idsAEliminar.length = 0;

      setNotaGuardada(true);
      setNotaDirty(false);

      Swal.fire({
        icon: "success",
        title: "Parámetro actualizado",
        text: "La nota mínima se guardó en la base de datos.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "No se pudo guardar la nota mínima. d",
      });
    }
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
      const isEditing = mode === "edit";
      const editingId = selected?.id ?? null;

      if (isEditing && !editingId) {
        await Swal.fire({
          title: "Error",
          text: "No se encontró el registro a editar.",
          icon: "error",
        });
        return;
      }

      if (isEditing) {
        // 📝 EDITAR
        if (tab === "RESPONSABLE") {
          await updateResponsable(editingId, form);
          const actualizados = await fetchResponsables();
          setResponsables(actualizados);
        } else if (tab === "COORDINADOR") {
          await updateCoordinador(editingId, form);
          const actualizados = await fetchCoordinadores();
          setCoordinadores(actualizados);
        }

        await Swal.fire({
          title: "Actualizado",
          text: "Los datos se guardaron correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // ✨ CREAR
        if (tab === "RESPONSABLE") {
          await createResponsable(form);
          const actualizados = await fetchResponsables();
          setResponsables(actualizados);
        } else if (tab === "COORDINADOR") {
          await createCoordinador(form);
          const actualizados = await fetchCoordinadores();
          setCoordinadores(actualizados);
        }

        await Swal.fire({
          title: "Creado",
          text: "El registro fue creado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // cerrar formulario / limpiar selección
      setShowForm(false);
      setSelected(null);
      setMode("create");
    } catch (e) {
      console.error("Error al guardar:", e);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al guardar el registro.",
        icon: "error",
      });
    }
  };

  // lista actual según pestaña
  const rows = tab === "RESPONSABLE" ? responsables : coordinadores;

  // eliminar
  const handleDelete = async (row) => {
    const id = row?.id;
    if (!id) return;

    try {
      // Confirmación
      const result = await Swal.fire({
        title: "¿Eliminar registro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
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
          title: "Eliminado",
          text: "El responsable fue eliminado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (tab === "COORDINADOR") {
        await deleteCoordinador(id);
        setCoordinadores((prev) => prev.filter((x) => x.id !== id));

        await Swal.fire({
          title: "Eliminado",
          text: "El coordinador fue eliminado correctamente.",
          icon: "success",
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
        title: "Error",
        text: "No se pudo eliminar el registro.",
        icon: "error",
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

  // ---- Handlers para ÁREAS (con backend) ----
  const handleCreateArea = async (nombre) => {
    try {
      const creada = await apiCreateArea(nombre); // POST /api/areas
      const nueva = {
        id: Number(creada.id_area),
        nombre: creada.nombre_area,
      };
      setAreas((prev) => [...prev, nueva]);
    } catch (e) {
      console.error("Error creando área:", e);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el área.",
        icon: "error",
      });
    }
  };

  const handleUpdateArea = async (id, nombre) => {
    try {
      const actualizada = await apiUpdateArea(id, nombre); // PUT /api/areas/:id
      const adaptada = {
        id: Number(actualizada.id_area),
        nombre: actualizada.nombre_area,
      };
      setAreas((prev) => prev.map((a) => (a.id === id ? adaptada : a)));
    } catch (e) {
      console.error("Error actualizando área:", e);
      Swal.fire({
        title: "Error",
        text: "No se pudo renombrar el área.",
        icon: "error",
      });
    }
  };

  const handleDeleteArea = async (id) => {
    try {
      await apiDeleteArea(id); // DELETE /api/areas/:id
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Error eliminando área:", e);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el área.",
        icon: "error",
      });
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  // datos de cantidades para el área seleccionada (solo VISUALIZACIÓN)
  const cantidadesVista =
    (areaVistaId && medallasArea[areaVistaId]?.cantidades) || {
      oro: 0,
      plata: 0,
      bronce: 0,
    };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Dashboard</span>
        <span className="text-lg font-bold text-gray-800">ADMINISTRADOR</span>
        <span className="text-xs text-gray-500">
          Gestión actual: <b>2025</b>
        </span>
      </div>

      {/* KPIs y estado */}
      <section className="space-y-4">
        {/* Número de Usuarios + botones de configuración */}
        <div className="panel flex items-center gap-4">
          <div>
            <label className="section">Número de Usuarios Registrados</label>
            <input disabled value={rows.length} className="kpi-input w-40" />
          </div>

          <div className="ml-auto flex gap-2">
            <button
              className="btn-light"
              onClick={() => setShowMedallasModal(true)}
            >
              Parametrizar medallas
            </button>
            <button
              className="btn-light"
              onClick={() => setShowAreasModal(true)}
            >
              Gestionar áreas
            </button>
          </div>
        </div>

        {/* Relación de Medallas por Área (SOLO VISUALIZACIÓN) */}
        <div className="panel">
          <p className="section">Relación de Medallas por Área</p>

          <div className="flex flex-wrap items-center gap-4">
            {/* selector de área */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Área:</span>
              <select
                value={areaVistaId ?? ""}
                onChange={(e) => setAreaVistaId(Number(e.target.value))}
                className="kpi-input min-w-[160px]"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* valores solo lectura */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 w-14">Oro:</span>
                <input
                  type="number"
                  disabled
                  value={cantidadesVista.oro}
                  className="kpi-input w-20 bg-gray-100 cursor-default"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 w-14">Plata:</span>
                <input
                  type="number"
                  disabled
                  value={cantidadesVista.plata}
                  className="kpi-input w-20 bg-gray-100 cursor-default"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 w-14">Bronce:</span>
                <input
                  type="number"
                  disabled
                  value={cantidadesVista.bronce}
                  className="kpi-input w-20 bg-gray-100 cursor-default"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parámetro: Nota mínima de clasificación */}
        <div className="panel">
          <p className="section">Parámetro de clasificación</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-700 text-sm">
              Nota mínima de clasificación:
            </span>
            <input
              type="number"
              min={1}
              max={100}
              value={notaMinima}
              onChange={handleChangeNotaMinima}
              className="kpi-input w-24"
            />
            <button
              onClick={guardarNotaMinima}
              disabled={!notaDirty}
              className={`btn-dark ${
                !notaDirty ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Guardar parámetro
            </button>
            {notaGuardada && (
              <span className="text-green-600 text-sm whitespace-nowrap">
                ✓ Guardado
              </span>
            )}
          </div>
          {notaError && (
            <p className="text-xs text-red-500 mt-1">{notaError}</p>
          )}
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

      {showMedallasModal && (
        <MedallasModal
          areas={areas}
          data={medallasArea}
          onSave={handleSaveMedallasArea}
          onClose={() => setShowMedallasModal(false)}
        />
      )}
    </AdminLayout>
  );
}
