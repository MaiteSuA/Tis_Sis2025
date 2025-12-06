// src/screens/RegistrarNotasReplanteado.jsx
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/search_bar";
import ExcelGrid from "../components/excel_grid";
import ActionButton from "../components/action_button";
import MetricCard from "../components/metric_card";
import Header from "../components/header";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export default function RegistrarNotasReplanteado() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [busqEval, setBusqEval] = useState("");
  const [busqHist, setBusqHist] = useState("");

  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // ============================
  //   NOMBRE DEL EVALUADOR
  // ============================
  const [nombreEvaluador, setNombreEvaluador] = useState("");

  useEffect(() => {
    const cargarNombreEvaluador = async () => {
      try {
        // Primero intentar desde localStorage
        const usuarioStr = localStorage.getItem("usuario");
        console.log("📝 localStorage 'usuario':", usuarioStr);
        
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          console.log("👤 Usuario parseado:", usuario);
          
          const nombre = usuario.nombre ?? "";
          const apellidos = usuario.apellidos ?? usuario.apellido ?? "";
          const full = `${nombre} ${apellidos}`.trim();
          
          if (full) {
            console.log("✅ Nombre desde localStorage:", full);
            setNombreEvaluador(full);
            return;
          }
        }

        // Si no hay datos válidos en localStorage, obtener desde API
        console.log("🔄 Obteniendo usuario desde API...");
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.warn("⚠️ No hay token, usando nombre por defecto");
          setNombreEvaluador("Evaluador");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.usuario) {
            const nombre = data.usuario.nombre ?? "";
            const apellidos = data.usuario.apellidos ?? data.usuario.apellido ?? "";
            const full = `${nombre} ${apellidos}`.trim();
            
            console.log("✅ Nombre desde API:", full);
            setNombreEvaluador(full || "Evaluador");
            
            // Actualizar localStorage
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
          } else {
            setNombreEvaluador("Evaluador");
          }
        } else {
          console.warn("⚠️ Error al obtener usuario desde API");
          setNombreEvaluador("Evaluador");
        }

      } catch (err) {
        console.error("❌ Error al cargar nombre del evaluador:", err);
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

    // Evaluaciones
    const resEval = await fetch(`${API_BASE_URL}/evaluaciones`);
    if (!resEval.ok) {
      const errorText = await resEval.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error al obtener evaluaciones: ${resEval.status}`);
    }
    
    const jsonEval = await resEval.json();
    console.log("📊 Respuesta del servidor:", jsonEval);
    
    // El backend devuelve { ok: true, data: [...] }
    const dataEval = jsonEval.ok ? jsonEval.data : (Array.isArray(jsonEval) ? jsonEval : []);
    
    console.log("✅ Evaluaciones cargadas:", dataEval.length, "registros");
    setEvaluaciones(dataEval);

    // Historial
    const resHist = await fetch(`${API_BASE_URL}/evaluaciones/historial`);
    if (resHist.ok) {
      const jsonHist = await resHist.json();
      const dataHist = jsonHist.ok ? jsonHist.data : (Array.isArray(jsonHist) ? jsonHist : []);
      console.log("✅ Historial cargado:", dataHist.length, "registros");
      setHistorial(dataHist);
    } else {
      console.warn("⚠️ No se pudo cargar el historial");
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
//   MÉTRICAS
// ============================
    const totalAsignados = evaluaciones.length;

    const totalHechas = evaluaciones.filter(
      (e) => String(e.nota ?? "").trim() !== ""
    ).length;

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
  //   DATOS FILTRADOS
  // ============================
  const dataEval = useMemo(
  () =>
    evaluaciones
      .map((r) => {
        const tieneNota = String(r.nota ?? "").trim() !== "";
        return {
          ...r,
          // 👉 estado siempre calculado desde la nota
          estado: tieneNota ? "Calificado" : "Pendiente",
        };
      })
      .filter(
        (r) =>
          (r.competidor || "")
            .toLowerCase()
            .includes(busqEval.toLowerCase()) ||
          (r.observacion || "")
            .toLowerCase()
            .includes(busqEval.toLowerCase())
        ),
       [evaluaciones, busqEval]
    );


  const dataHist = useMemo(
    () =>
      historial.filter(
        (r) =>
          (r.competidor || "")
            .toLowerCase()
            .includes(busqHist.toLowerCase()) ||
          (r.usuario || "")
            .toLowerCase()
            .includes(busqHist.toLowerCase())
      ),
    [historial, busqHist]
  );

  // ============================
  //   HANDLERS
  // ============================
  const onCellChange = (id, field, value) => {
    console.log("📝 Cambio detectado:", { id, field, value });
    
    setEvaluaciones((prev) =>
      prev.map((r) => {
        // Buscar por id_evaluacion primero, luego por id
        const matches = r.id_evaluacion === id || r.id === id;
        
        if (matches) {
          console.log("✅ Actualizando registro:", r.competidor);
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleGuardarCambios = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setMensajeGuardado("");
      setError("");

      // IMPORTANTE: Enviar solo evaluaciones que tengan id_evaluacion
      const evaluacionesConId = evaluaciones
        .filter(ev => ev.id_evaluacion) // Solo las que tienen id_evaluacion
        .map(ev => ({
          id_evaluacion: ev.id_evaluacion,
          nota: ev.nota,
          observacion: ev.observacion
        }));

      if (evaluacionesConId.length === 0) {
        setError("No hay evaluaciones para guardar");
        return;
      }

      console.log("📤 Enviando evaluaciones:", evaluacionesConId.length, "registros");

      const res = await fetch(`${API_BASE_URL}/evaluaciones`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluacionesConId),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Error del servidor:", errorData);
        throw new Error(`Error al guardar cambios: ${res.status}`);
      }

      const json = await res.json();
      const message = json?.data?.message || json?.message || "Cambios guardados correctamente";

      console.log("✅ Guardado exitoso:", message);
      setMensajeGuardado(message);
      await cargarDatos();

      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (err) {
      console.error("❌ Error en handleGuardarCambios:", err);
      setError(err.message || "Error al guardar cambios");
    }
  };

  const [areaNombre, setAreaNombre] = useState("");

useEffect(() => {
  const cargarArea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const r1 = await fetch(`${API_BASE_URL}/evaluadores/mi-perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!r1.ok) {
        console.warn("No se pudo obtener el perfil de evaluador");
        return;
      }
      
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
    <div className="min-h-screen bg-gray-100 pt-30 p-6">
      <Header />

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

        {/* Encabezado superior: Dashboard / Área / Nivel */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Dashboard:</span>
            <span className="text-slate-600">Clasificación General</span>
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
              Lista de Evaluaciones - Clasificatoria
            </h2>
            <SearchBar value={busqEval} onChange={setBusqEval} />
          </div>

          <div className="max-h-[210px] overflow-y-auto overscroll-contain p-4">
            <ExcelGrid
              columns={columnsEval}
              data={dataEval}
              onCellChange={onCellChange}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-slate-200 bg-gray-200 rounded-b-xl">
            <div className="text-xs text-slate-500">
              {totalAsignados} registros · {totalPendientes} pendientes ·{" "}
              {totalHechas} con nota
            </div>
            <div className="flex gap-2">
              <ActionButton type="edit" label="Editar" />
              <ActionButton
                type="save"
                label="Guardar cambios"
                onClick={handleGuardarCambios}
              />
              <ActionButton type="export" label="Exportar" />
            </div>
          </div>
        </section>

        {/* HISTORIAL */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-black">Historial</h2>
            <SearchBar value={busqHist} onChange={setBusqHist} />
          </div>
          <div className="max-h-[210px] overflow-y-auto overscroll-contain p-4">
            <ExcelGrid
              columns={columnsHist}
              data={dataHist}
              onCellChange={(id, f, v) =>
                setHistorial((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, [f]: v } : r))
                )
              }
              onDeleteRow={(id) =>
                setHistorial((prev) =>
                  prev.length > 1 ? prev.filter((r) => r.id !== id) : prev
                )
              }
              onAddRow={() => {
                const hoy = new Date().toISOString().split("T")[0];
                setHistorial((prev) => [
                  ...prev,
                  {
                    id: Math.max(0, ...prev.map((p) => Number(p.id) || 0)) + 1,
                    competidor: "",
                    notaAnterior: "",
                    notaNueva: "",
                    fecha: hoy,
                    usuario: "",
                  },
                ]);
              }}
              className="rounded-lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}