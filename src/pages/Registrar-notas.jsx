// src/screens/RegistrarNotasReplanteado.jsx
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/search_bar";
import ExcelGrid from "../components/excel_grid";
import ActionButton from "../components/action_button";
import MetricCard from "../components/metric_card";
import Header from "../components/headEva";
import { useEstadoProceso } from "../hook/useEstadoProceso"; // ✅ agregado

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export default function RegistrarNotasReplanteado() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [busqEval, setBusqEval] = useState("");
  const [busqHist, setBusqHist] = useState("");

  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false); // Controla si se puede editar

  // ============================
  //   NOMBRE DEL EVALUADOR
  // ============================
  const [nombreEvaluador, setNombreEvaluador] = useState("");
  const [nivelAsignado, setNivelAsignado] = useState("");

  // ✅ fase/estado de proceso (label)
  const { label } = useEstadoProceso(); // ej. "Fase final", "Fase clasificatoria"

  useEffect(() => {
    const cargarNombreEvaluador = async () => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          const nombre = usuario.nombre ?? "";
          const apellidos = usuario.apellidos ?? usuario.apellido ?? "";
          const full = `${nombre} ${apellidos}`.trim();
          if (full) {
            setNombreEvaluador(full);
            return;
          }
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setNombreEvaluador("Evaluador");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.usuario) {
            const nombre = data.usuario.nombre ?? "";
            const apellidos = data.usuario.apellidos ?? data.usuario.apellido ?? "";
            const full = `${nombre} ${apellidos}`.trim();
            setNombreEvaluador(full || "Evaluador");
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
          } else {
            setNombreEvaluador("Evaluador");
          }
        } else {
          setNombreEvaluador("Evaluador");
        }
      } catch {
        setNombreEvaluador("Evaluador");
      }
    };

    cargarNombreEvaluador();
  }, []);

  // ============================
  //   CARGA DE DATOS DESDE BACK
  // ============================
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Evaluaciones
      const resEval = await fetch(`${API_BASE_URL}/evaluaciones`, { headers });
      if (!resEval.ok) {
        const errorText = await resEval.text();
        console.error("❌ Error del servidor:", errorText);
        throw new Error(`Error al obtener evaluaciones: ${resEval.status}`);
      }
      const jsonEval = await resEval.json();
      const dataEval = jsonEval.ok ? jsonEval.data : (Array.isArray(jsonEval) ? jsonEval : []);
      if (dataEval.length > 0 && dataEval[0].nivel) {
        setNivelAsignado(dataEval[0].nivel);
      }
      setEvaluaciones(dataEval);

      // Historial (solo lectura)
      const resHist = await fetch(`${API_BASE_URL}/evaluaciones/historial`, { headers });
      if (resHist.ok) {
        const jsonHist = await resHist.json();
        const dataHist = jsonHist.ok ? jsonHist.data : (Array.isArray(jsonHist) ? jsonHist : []);
        setHistorial(dataHist);
      } else {
        setHistorial([]);
      }
    } catch (err) {
      console.error("❌ Error en cargarDatos:", err);
      setError(err.message || "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================
  //   HELPERS Y MÉTRICAS
  // ============================
  const estaCalificado = (r) =>
    r.nota !== null && r.nota !== undefined && String(r.nota).trim() !== "";

  const totalAsignados = evaluaciones.length;
  const totalHechas = evaluaciones.filter(estaCalificado).length;
  const totalPendientes = totalAsignados - totalHechas;

  // ============================
  //   COLUMNAS
  // ============================
  const columnsEval = useMemo(
    () => [
      { header: "Competidor", field: "competidor", align: "left" },
      { header: "Nota", field: "nota", align: "center", width: "w-24" },
      { header: "Observación", field: "observacion", align: "left" },
      { header: "Estado", field: "estado", align: "center", width: "w-40" },
    ],
    []
  );

  const columnsHist = useMemo(
    () => [
      { header: "Competidor", field: "competidor", align: "left" },
      { header: "Nota Anterior", field: "notaAnterior", align: "center", width: "w-28" },
      { header: "Nota Nueva", field: "notaNueva", align: "center", width: "w-28" },
      { header: "Fecha", field: "fecha", align: "center", width: "w-32" },
      { header: "Usuario", field: "usuario", align: "center", width: "w-28" },
    ],
    []
  );

  // ============================
  //   DATOS FILTRADOS + ESTADO
  // ============================
  const dataEval = useMemo(
    () =>
      evaluaciones
        .map((r) => ({
          ...r,
          // Estado calculado SOLO por existencia de nota
          estado: estaCalificado(r) ? "Calificado" : "Pendiente",
        }))
        .filter(
          (r) =>
            (r.competidor || "").toLowerCase().includes(busqEval.toLowerCase()) ||
            (r.observacion || "").toLowerCase().includes(busqEval.toLowerCase())
        ),
    [evaluaciones, busqEval]
  );

  const dataHist = useMemo(
    () =>
      historial.filter(
        (r) =>
          (r.competidor || "").toLowerCase().includes(busqHist.toLowerCase()) ||
          (r.usuario || "").toLowerCase().includes(busqHist.toLowerCase())
      ),
    [historial, busqHist]
  );

  // ============================
  //   HANDLERS
  // ============================
  const onCellChange = (id, field, value) => {
    if (!modoEdicion) return;

    if (field === "nota" && value !== "") {
      const notaNum = parseFloat(value);
      if (isNaN(notaNum) || notaNum < 0 || notaNum > 100) {
        setError("La nota debe estar entre 0 y 100");
        setTimeout(() => setError(""), 3000);
        return;
      }
    }

    setEvaluaciones((prev) =>
      prev.map((r) => {
        const matches = r.id_evaluacion === id || r.id === id;
        if (matches) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleEditar = () => {
    setModoEdicion(true);
    setMensajeGuardado("Modo de edición activado");
    setTimeout(() => setMensajeGuardado(""), 2000);
  };

  const handleGuardarCambios = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!modoEdicion) {
      setError("Debes activar el modo de edición primero");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setMensajeGuardado("");
      setError("");

      const evaluacionesConId = evaluaciones
        .filter((ev) => ev.id_evaluacion)
        .map((ev) => ({
          id_evaluacion: ev.id_evaluacion,
          nota: ev.nota,
          observacion: ev.observacion,
        }));

      if (evaluacionesConId.length === 0) {
        setError("No hay evaluaciones para guardar");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/evaluaciones`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluacionesConId),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Error del servidor:", errorData);
        throw new Error(`Error al guardar cambios: ${res.status}`);
      }

      const json = await res.json();
      const message =
        json?.data?.message || json?.message || "Cambios guardados correctamente";

      setMensajeGuardado(message);
      setModoEdicion(false);
      await cargarDatos();

      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (err) {
      console.error("❌ Error en handleGuardarCambios:", err);
      setError(err.message || "Error al guardar cambios");
    }
  };

  const handleEnviar = async () => {
    const todasCalificadas = evaluaciones.every((ev) => estaCalificado(ev));
    if (!todasCalificadas) {
      setError("Debes calificar a todos los competidores antes de enviar");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!confirm("¿Estás seguro de enviar las evaluaciones? Esta acción notificará al responsable de área.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/evaluaciones/notificar-responsable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          evaluador: nombreEvaluador,
          area: areaNombre,
          totalEvaluaciones: evaluaciones.length,
        }),
      });

      if (res.ok) {
        setMensajeGuardado("✅ Evaluaciones enviadas correctamente. El responsable ha sido notificado.");
        setTimeout(() => setMensajeGuardado(""), 4000);
      } else {
        throw new Error("Error al enviar notificación");
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      setError("Error al enviar la notificación");
      setTimeout(() => setError(""), 3000);
    }
  };

  // === CONTEXTO DEL EVALUADOR (Área) ===
  const [areaNombre, setAreaNombre] = useState("");

  useEffect(() => {
    const cargarArea = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const r1 = await fetch(`${API_BASE_URL}/evaluadores/mi-perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!r1.ok) return;
        const j1 = await r1.json();
        const area = j1?.evaluador?.area;
        if (area?.nombre_area) {
          setAreaNombre(area.nombre_area);
        }
      } catch (e) {
        console.warn("Contexto área no disponible:", e.message);
        setAreaNombre("");
      }
    };
    cargarArea();
  }, []);

  // ============================
  //   RENDER
  // ============================
  const nombreSeguro = typeof nombreEvaluador === "string" ? nombreEvaluador : "";
  const avatarLetter = (nombreSeguro.trim()[0] || "E").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 pt-28 p-6">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </div>
      <div className="bg-gray-200 rounded-lg max-w-7xl mx-auto space-y-6 p-5">
        {/* Bloque de usuario */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold select-none">
              {avatarLetter}
            </div>
            <div>
              <div className="text-sm text-slate-500 leading-tight">Evaluador</div>
              <div className="text-base sm:text-lg font-semibold text-slate-800">
                {nombreSeguro || "Evaluador"}
              </div>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            Sesión activa · {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Encabezado superior: Dashboard / Área */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Dashboard:</span>
            <h2 className="text-lg sm:text-xl font-bold text-black">
              {label?.toLowerCase().includes("final")
                ? "Lista de Evaluaciones - Fase final"
                : "Lista de Evaluaciones - Clasificatoria"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Área:</span>
            <span className="text-slate-600">{areaNombre || "—"}</span>
          </div>
        </div>

        {/* Mensajes de estado */}
        {(cargando || error || mensajeGuardado) && (
          <div className="space-y-2">
            {cargando && (
              <div className="text-sm text-blue-700 bg-blue-100 border border-blue-200 rounded-md px-3 py-2">
                Cargando datos…
              </div>
            )}
            {error && (
              <div className="text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {mensajeGuardado && !error && (
              <div className="text-sm text-green-700 bg-green-100 border border-green-200 rounded-md px-3 py-2">
                {mensajeGuardado}
              </div>
            )}
          </div>
        )}

        {/* MÉTRICAS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <MetricCard label="Cantidad Asignados:" value={totalAsignados} />
            <MetricCard label="Cantidad Pendientes" value={totalPendientes} showDivider />
            <MetricCard label="Cantidad Hechas" value={totalHechas} showDivider />
          </div>
        </section>

        {/* EVALUACIONES */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-xl">
            <h2 className="text-lg sm:text-xl font-bold text-black">
              {label?.toLowerCase().includes("final")
                ? "Lista de Evaluaciones - Fase final"
                : "Lista de Evaluaciones - Clasificatoria"}
            </h2>
            <SearchBar value={busqEval} onChange={setBusqEval} />
          </div>

          <div className="max-h-[210px] overflow-y-auto overscroll-contain p-4">
            <ExcelGrid
              columns={columnsEval}
              data={dataEval}
              onCellChange={onCellChange}
              className="rounded-lg"
              readOnly={!modoEdicion}
              // renderCell: bloquea COMPETIDOR y ESTADO
              renderCell={(row, col, rowIndex, colIndex, onChange) => {
                // 🔒 COMPETIDOR — NO EDITABLE
                if (col.field === "competidor") {
                  return (
                    <div className="px-2 py-1 text-sm text-gray-700">
                      {row.competidor}
                    </div>
                  );
                }

                // 🔒 ESTADO — NO EDITABLE + COLOR
                if (col.field === "estado") {
                  const estadoClass =
                    row.estado === "Calificado" ? "text-green-600" : "text-red-600";
                  return (
                    <div className={`px-2 py-1 text-center text-sm font-semibold ${estadoClass}`}>
                      {row.estado}
                    </div>
                  );
                }

                // 🔓 OTRAS COLUMNAS → input editable según modo
                return (
                  <input
                    type="text"
                    value={row[col.field] || ""}
                    onChange={(e) =>
                      onChange(row.id_evaluacion || row.id, col.field, e.target.value)
                    }
                    placeholder={col.placeholder || ""}
                    className="w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none bg-transparent"
                    disabled={!modoEdicion}
                  />
                );
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-slate-200 bg-gray-200 rounded-b-xl">
            <div className="text-xs text-slate-500">
              {totalAsignados} registros · {totalPendientes} pendientes · {totalHechas} con nota
            </div>
            <div className="flex gap-2">
              <ActionButton
                type="edit"
                label={modoEdicion ? "Editando..." : "Editar"}
                onClick={handleEditar}
                disabled={modoEdicion}
              />
              <ActionButton
                type="save"
                label="Guardar cambios"
                onClick={handleGuardarCambios}
                disabled={!modoEdicion}
              />
            </div>
          </div>
        </section>

        {/* HISTORIAL (SOLO LECTURA) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-black">Historial</h2>
            <SearchBar value={busqHist} onChange={setBusqHist} />
          </div>

          <div className="max-h-[210px] overflow-y-auto overscroll-contain p-4">
            <ExcelGrid
              columns={columnsHist}
              data={dataHist}
              className="rounded-lg"
              // 🔒 Historial en solo lectura: todas las celdas como texto plano
              renderCell={(row, col) => (
                <div
                  className={
                    "px-2 py-1 text-sm " +
                    (col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left")
                  }
                >
                  {row[col.field] ?? ""}
                </div>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
