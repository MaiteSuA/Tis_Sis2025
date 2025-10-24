import { useState, useMemo } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import SearchBar from "../components/search_bar";
import ExcelGrid from "../components/excel_grid";
import ActionButton from "../components/action_button";
import MetricCard from "../components/metric_card";
import useEvaluaciones from "../hook/use_evaluaciones";
import { getColumns } from "../utils/table_config";

const EvaluacionesClasificatoria = () => {
  const [busqueda, setBusqueda] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const {
    evaluaciones,
    errorValidacion,
    onCellChange,
    onDeleteRow,
    agregarFila,
  } = useEvaluaciones();

  // Métricas calculadas
  const metricas = useMemo(() => ({
    asignados: evaluaciones.length,
    pendientes: evaluaciones.filter((e) => e.estado === "Pendiente").length,
    completadas: evaluaciones.filter((e) => String(e.nota).trim() !== "").length,
  }), [evaluaciones]);

  // Datos filtrados
  const dataFiltrada = useMemo(
    () =>
      evaluaciones.filter(
        (ev) =>
          (ev.competidor || "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (ev.observacion || "").toLowerCase().includes(busqueda.toLowerCase())
      ),
    [evaluaciones, busqueda]
  );

  // Render personalizado de celdas
  const renderCell = (row, col) => {
    if (col.field === "competidor") {
      return (
        <input
          type="text"
          value={row.competidor}
          onChange={(e) => onCellChange(row.id, "competidor", e.target.value)}
          placeholder="Nombre del competidor"
          className="w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-gray-300 focus:ring-inset outline-none bg-transparent"
        />
      );
    }

    if (col.field === "nota") {
      const hasError = !!errorValidacion[row.id];
      return (
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={row.nota}
            onChange={(e) => onCellChange(row.id, "nota", e.target.value)}
            placeholder="0-100"
            className={`w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-inset outline-none bg-transparent text-center ${
              hasError ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-gray-300"
            }`}
          />
          {hasError && (
            <div className="absolute top-full left-0 right-0 bg-red-600 text-white text-xs px-2 py-1 z-10 flex items-center gap-1">
              <AlertCircle size={10} />
              <span>{errorValidacion[row.id]}</span>
            </div>
          )}
        </div>
      );
    }

    if (col.field === "observacion") {
      return (
        <input
          type="text"
          value={row.observacion}
          onChange={(e) => onCellChange(row.id, "observacion", e.target.value)}
          placeholder="Comentarios adicionales"
          className="w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-gray-300 focus:ring-inset outline-none bg-transparent"
        />
      );
    }

    if (col.field === "estado") {
      const estados = {
        Pendiente: "bg-white text-gray-700",
        Clasificado: "bg-green-100 text-green-800",
        "No Clasificado": "bg-red-100 text-red-800",
        Desclasificado: "bg-yellow-100 text-yellow-800",
      };

      return (
        <select
          value={row.estado}
          onChange={(e) => onCellChange(row.id, "estado", e.target.value)}
          className={`w-full h-full px-2 py-1.5 text-sm font-medium border-none focus:ring-2 focus:ring-gray-300 focus:ring-inset outline-none ${estados[row.estado]}`}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Clasificado">Clasificado</option>
          <option value="No Clasificado">No Clasificado</option>
          <option value="Desclasificado">Desclasificado</option>
        </select>
      );
    }

    return null;
  };

  const handleGuardar = () => {
    setMensajeGuardado("Guardado automáticamente");
    setTimeout(() => setMensajeGuardado(""), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-200 rounded-lg max-w-7xl mx-auto p-5">
        {/* Métricas */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-4">
          <div className="grid grid-cols-3 divide-x divide-slate-300">
            <MetricCard label="Cantidad Asignados:" value={metricas.asignados} />
            <MetricCard label="Cantidad Pendientes" value={metricas.pendientes} showDivider />
            <MetricCard label="Cantidad Hechas" value={metricas.completadas} showDivider />
          </div>
        </div>


        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Lista de Evaluaciones - Clasificatoria
          </h1>

          {mensajeGuardado && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">{mensajeGuardado}</span>
            </div>
          )}

          <SearchBar value={busqueda} onChange={setBusqueda} />
        </div>

        {/* Grid */}
        <ExcelGrid
          columns={getColumns()}
          data={dataFiltrada}
          onCellChange={onCellChange}
          onDeleteRow={onDeleteRow}
          onAddRow={agregarFila}
          renderCell={renderCell}
          className="rounded-lg"
        />

        {/* Acciones */}
        <div className="bg-gray-200 flex justify-end gap-3 mt-4 p-5">
          <ActionButton
            type="edit"
            label="Editar"
            onClick={() => console.log("Editar")}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          />
          <ActionButton
            type="save"
            label="Guardar"
            onClick={handleGuardar}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>}
          />
          <ActionButton
            type="export"
            label="Exportar"
            onClick={() => console.log("Exportar")}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesClasificatoria;