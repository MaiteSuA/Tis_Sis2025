// src/pages/EvaluacionesClasificatoria.jsx
import { useState, useMemo } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import SearchBar from "../components/search_bar";
import ExcelGrid from "../components/excel_grid";
import ActionButton from "../components/action_button";

const EvaluacionesClasificatoria = () => {
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, competidor: "", nota: "", observacion: "", estado: "Pendiente" },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [errorValidacion, setErrorValidacion] = useState({});

  // Config columnas para el Grid
  const columns = useMemo(
    () => [
      { header: "Competidor", field: "competidor", align: "center" },
      { header: "Nota", field: "nota", width: "w-24", align: "center" },
      { header: "Observación", field: "observacion", align: "center" },
      { header: "Estado", field: "estado", align: "center", width: "w-44", align: "center" },
    ],
    []
  );

  // Validacion de nota
  const validarNota = (nota) => {
    if (nota === "") return true;
    const num = Number(nota);
    return Number.isFinite(num) && num >= 0 && num <= 100;
  };

  // Cambios de celda (genérico)
  const onCellChange = (id, field, value) => {
    if (field === "nota") {
      if (!validarNota(value)) {
        setErrorValidacion((prev) => ({
          ...prev,
          [id]: "La nota debe ser un número entre 0 y 100",
        }));
        // igual guardamos el valor para que el usuario lo corrija
      } else {
        setErrorValidacion((prev) => ({ ...prev, [id]: "" }));
      }
    }

    setEvaluaciones((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Eliminar fila
  const onDeleteRow = (id) => {
    setEvaluaciones((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  // Agregar fila
  const agregarFila = () => {
    const nuevoId = Math.max(0, ...evaluaciones.map((e) => e.id)) + 1;
    setEvaluaciones((prev) => [
      ...prev,
      { id: nuevoId, competidor: "", nota: "", observacion: "", estado: "Pendiente" },
    ]);
  };

  // Filtrado por busqueda
  const dataFiltrada = useMemo(
    () =>
      evaluaciones.filter(
        (ev) =>
          (ev.competidor || "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (ev.observacion || "").toLowerCase().includes(busqueda.toLowerCase())
      ),
    [evaluaciones, busqueda]
  );

  // Renderizar celdas específicas (inputs/select y validacion visual)
  const renderCell = (row, col, rowIndex, colIndex, onCellChange) => {
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
        <div className="p-0">
          <input
            type="text"
            inputMode="numeric"
            value={row.nota}
            onChange={(e) => onCellChange(row.id, "nota", e.target.value)}
            placeholder="0-100"
            className={`w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-gray-300 focus:ring-inset outline-none bg-transparent text-center ${
              hasError ? "ring-2 ring-red-400" : ""
            }`}
          />
          {hasError && (
            <div className="flex items-center gap-1 px-2 py-1 text-red-600 text-xs">
              <AlertCircle size={12} />
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
      const base =
        "w-full h-full px-2 py-1.5 text-sm font-medium border-none focus:ring-2 focus:ring-gray-300 focus:ring-inset outline-none rounded-none";
      const k = row.estado;
      const color =
        k === "Clasificado"
          ? "bg-green-100 text-green-800"
          : k === "No Clasificado"
          ? "bg-red-100 text-red-800"
          : k === "Desclasificado"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-white text-gray-700";

      return (
        <select
          value={row.estado}
          onChange={(e) => onCellChange(row.id, "estado", e.target.value)}
          className={`${base} ${color}`}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Clasificado">Clasificado</option>
          <option value="No Clasificado">No Clasificado</option>
          <option value="Desclasificado">Desclasificado</option>
        </select>
      );
    }

    // Fallback a input por defecto
    return (
      <input
        type="text"
        value={row[col.field] ?? ""}
        onChange={(e) => onCellChange(row.id, col.field, e.target.value)}
        placeholder={col.placeholder ?? ""}
        className="w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none bg-transparent"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-200 rounded-lg max-w-7xl mx-auto p-5">
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

        {/* GRID tabla*/}
        <ExcelGrid
          columns={columns}
          data={dataFiltrada}
          onCellChange={onCellChange}
          onDeleteRow={onDeleteRow}
          onAddRow={agregarFila}
          renderCell={renderCell}
          className="rounded-lg"
        />

        {/* Acciones */}
        <div className="bg-gray-200 flex justify-end gap-3 mt-4 p-5">
          <ActionButton type="edit" label="Editar" onClick={() => console.log("Editar")} />
          <ActionButton type="save" label="Guardar Cambios" onClick={() => console.log("Guardar")} />
          <ActionButton type="export" label="Exportar" onClick={() => console.log("Exportar")} />
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesClasificatoria;
