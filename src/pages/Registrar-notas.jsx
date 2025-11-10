import { useMemo, useState } from "react";
import SearchBar from "../components/search_bar";
import ExcelGrid from "../components/excel_grid";
import ActionButton from "../components/action_button";
import MetricCard from "../components/metric_card";
import datos from "../data/datos_prueba.json";
import Header from "../components/header";

export default function RegistrarNotasReplanteado() {
  // ----- estado demo -----
  const [evaluaciones, setEvaluaciones] = useState(datos.clasificados);
  const [historial, setHistorial] = useState(datos.historial);
  const [busqEval, setBusqEval] = useState("");
  const [busqHist, setBusqHist] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  // ----- metricas -----
  const totalAsignados = evaluaciones.length;
  const totalPendientes = evaluaciones.filter(e => e.estado === "Pendiente").length;
  const totalHechas = evaluaciones.filter(e => String(e.nota).trim() !== "").length;

  // ----- columnas -----
  const columnsEval = useMemo(() => [
    { header: "Competidor", field: "competidor", align: "left" },
    { header: "Nota", field: "nota", align: "center", width: "w-24" },
    { header: "Observación", field: "observacion", align: "left" },
    { header: "Estado", field: "estado", align: "center", width: "w-40" },
  ], []);

  const columnsHist = useMemo(() => [
    { header: "Competidor", field: "competidor", align: "left" },
    { header: "Nota Anterior", field: "notaAnterior", align: "center", width: "w-28" },
    { header: "Nota Nueva", field: "notaNueva", align: "center", width: "w-28" },
    { header: "Fecha", field: "fecha", align: "center", width: "w-32" },
    { header: "Usuario", field: "usuario", align: "center", width: "w-28" },
  ], []);

  const dataEval = useMemo(
    () => evaluaciones.filter(
      r => (r.competidor||"").toLowerCase().includes(busqEval.toLowerCase())
        || (r.observacion||"").toLowerCase().includes(busqEval.toLowerCase())
    ),
    [evaluaciones, busqEval]
  );

  const dataHist = useMemo(
    () => historial.filter(
      r => (r.competidor||"").toLowerCase().includes(busqHist.toLowerCase())
        || (r.usuario||"").toLowerCase().includes(busqHist.toLowerCase())
    ),
    [historial, busqHist]
  );

  // ----- handlers minimos -----
  const onCellChange = (id, field, value) =>
    setEvaluaciones(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  return (
    <div className="min-h-screen bg-gray-100 pt-30 p-6">
      <Header />
      <div className="bg-gray-200 rounded-lg max-w-7xl mx-auto space-y-6 p-5">
        {/* Encabezado superior: Dashboard / Área / Nivel */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Dashboard:</span>
            <span className="text-slate-600">Clasificación General</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Área:</span>
            <span className="text-slate-600">"default"</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Nivel:</span>
            <span className="text-slate-600">"default"</span>
          </div>
        </div>

        {/* METRICAS: fila compacta con divisores */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <MetricCard label="Cantidad Asignados:" value={totalAsignados} />
            <MetricCard label="Cantidad Pendientes" value={totalPendientes} showDivider />
            <MetricCard label="Cantidad Hechas" value={totalHechas} showDivider />
          </div>
        </section>

        {/* EVALUACIONES */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {/* header de seccion */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-xl">
            <h2 className="text-lg sm:text-xl font-bold text-black">
              Lista de Evaluaciones - Clasificatoria
            </h2>
            <SearchBar value={busqEval} onChange={setBusqEval} />
          </div>

          {/* tabla */}
          <div className="max-h-[210px] overflow-y-auto overscroll-contain p-4">
            <ExcelGrid
              columns={columnsEval}
              data={dataEval}
              onCellChange={onCellChange}
              className="rounded-lg"
            />
          </div>

          {/* acciones */}
          <div className="flex justify-end gap-2 p-4 border-t border-slate-200 bg-gray-200 rounded-b-xl">
            <ActionButton type="edit" label="Editar" />
            <ActionButton type="save" label="Guardar cambios" onClick={()=>{
              setMensajeGuardado("Guardado");
              setTimeout(()=>setMensajeGuardado(""),1500);
            }}/>
            <ActionButton type="export" label="Exportar" />
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
                setHistorial(prev => prev.map(r => r.id===id?{...r,[f]:v}:r))
              }
              onDeleteRow={(id)=>
                setHistorial(prev => prev.length>1?prev.filter(r=>r.id!==id):prev)
              }
              onAddRow={()=>{
                const hoy = new Date().toISOString().split("T")[0];
                setHistorial(prev => [...prev, {
                  id: Math.max(0,...prev.map(p=>p.id))+1,
                  competidor:"", notaAnterior:"", notaNueva:"", fecha:hoy, usuario:""
                }])
              }}
              className="rounded-lg"
            />
          </div>
        </section>

      </div>
    </div>
  );
}
