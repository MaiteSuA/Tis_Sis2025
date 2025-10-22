import { useState } from "react";
import { Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import SearchBar from "../components/search_bar";

const EvaluacionesClasificatoria = () => {
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, competidor: "", nota: "", observacion: "", estado: "Pendiente" },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [errorValidacion, setErrorValidacion] = useState({});

  const validarNota = (nota) => {
    if (nota === "") return true;
    const num = parseFloat(nota);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  const handleNotaChange = (id, valor) => {
    if (validarNota(valor)) {
      setEvaluaciones((prev) =>
        prev.map((ev) => (ev.id === id ? { ...ev, nota: valor } : ev))
      );
      setErrorValidacion((prev) => ({ ...prev, [id]: "" }));
    } else {
      setErrorValidacion((prev) => ({
        ...prev,
        [id]: "La nota debe ser un número entre 0 y 100",
      }));
    }
  };

  const handleCompetidorChange = (id, valor) => {
    setEvaluaciones((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, competidor: valor } : ev))
    );
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    setEvaluaciones((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, estado: nuevoEstado } : ev))
    );
  };

  const handleObservacionChange = (id, valor) => {
    setEvaluaciones((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, observacion: valor } : ev))
    );
  };

  const agregarFila = () => {
    const nuevoId = Math.max(...evaluaciones.map((e) => e.id), 0) + 1;
    setEvaluaciones((prev) => [
      ...prev,
      {
        id: nuevoId,
        competidor: "",
        nota: "",
        observacion: "",
        estado: "Pendiente",
      },
    ]);
  };

  const eliminarFila = (id) => {
    if (evaluaciones.length > 1) {
      setEvaluaciones((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  const evaluacionesFiltradas = evaluaciones.filter(
    (ev) =>
      (ev.competidor || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (ev.observacion || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-200 rounded-lg max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 flex-row">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-slate-800">
              Lista de Evaluaciones - Clasificatoria
            </h1>

            <SearchBar value={busqueda} onChange={setBusqueda} />
          </div>
        </div>
        
        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 w-16">
                    Nº
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Competidor
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700 w-32">
                    Nota
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Observación
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 w-40">
                    Estado
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700 w-20">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluacionesFiltradas.map((evaluacion, index) => (
                  <tr key={evaluacion.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={evaluacion.competidor}
                        onChange={(e) =>
                          handleCompetidorChange(evaluacion.id, e.target.value)
                        }
                        placeholder="Nombre del competidor"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <input
                          type="text"
                          value={evaluacion.nota}
                          onChange={(e) =>
                            handleNotaChange(evaluacion.id, e.target.value)
                          }
                          placeholder="0-100"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                            errorValidacion[evaluacion.id]
                              ? "border-red-400"
                              : "border-slate-300"
                          } text-right`}
                        />
                        {errorValidacion[evaluacion.id] && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle size={12} />
                            <span>{errorValidacion[evaluacion.id]}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={evaluacion.observacion}
                        onChange={(e) =>
                          handleObservacionChange(evaluacion.id, e.target.value)
                        }
                        placeholder="Comentarios adicionales"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={evaluacion.estado}
                        onChange={(e) =>
                          handleEstadoChange(evaluacion.id, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                          ${
                            evaluacion.estado === "Clasificado"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : evaluacion.estado === "No Clasificado"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : evaluacion.estado === "Desclasificado"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-white text-gray-600 border-gray-300"
                          }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Clasificado">Clasificado</option>
                        <option value="No Clasificado">No Clasificado</option>
                        <option value="Desclasificado">Desclasificado</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => eliminarFila(evaluacion.id)}
                          disabled={evaluaciones.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Eliminar fila"
                          aria-label="Eliminar fila"
                        >
                          <Trash2 size={18} />
                        </button>

                        {evaluacion.id === evaluaciones[evaluaciones.length - 1]?.id && (
                          <button
                            onClick={agregarFila}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Agregar competidor (nueva fila)"
                            aria-label="Agregar competidor"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-gray-200 flex justify-end gap-3 mt-4 p-5">
          <button className="bg-white hover:bg-gray-100 text-black font-medium px-4 py-2 rounded-lg transition">
            Editar
          </button>
          <button className="bg-white hover:bg-gray-100 text-black font-medium px-4 py-2 rounded-lg transition">
            Guardar Cambios
          </button>
          <button className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg transition">
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesClasificatoria;
