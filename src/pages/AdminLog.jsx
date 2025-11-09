// Importa el hook useState de React para manejar estados locales
import { useState } from "react";
// Importa el layout del panel de administrador
import AdminLayout from "../components/AdminLayout.jsx";

//  Ejemplo de datos mock (luego lo cambias por props o fetch)
const MOCK_ROWS = [
  {
    id: 1,
    usuario: "María Pérez",
    fecha: "2025-10-25",
    hora: "18:45",
    competidor: "Juan Gutiérrez",
    area: "Ventas",
    notaActual: 85,
    notaNueva: 90,
    obs: "Ajuste por recálculo. Excelente desempeño.",
  },
  {
    id: 2,
    usuario: "Carlos Rojas",
    fecha: "2025-10-25",
    hora: "18:50",
    competidor: "Ana Torres",
    area: "Atención Cliente",
    notaActual: 92,
    notaNueva: 92,
    obs: "Agregó observación sin cambio de nota.",
  },
];

// Componente principal: página de auditoría (log de evaluaciones)
export default function AdminLog() {
  // estados de filtro
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // handlers de export
  const handleExportExcel = () => {
    // TODO: aquí conectas tu export real (ej. XLSX.utils.json_to_sheet + file-saver)
    console.log("Exportar a Excel con filas filtradas...");
  };

  // Handler: exportar resultados filtrados a PDF
  const handleExportPDF = () => {
    // TODO: aquí conectas tu export real (ej. jsPDF / pdfmake)
    console.log("Exportar a PDF con filas filtradas...");
  };

  // handler de búsqueda
  const handleBuscar = () => {
    console.log("Buscar con:", {
      usuario: filtroUsuario,
      area: filtroArea,
      fecha: filtroFecha,
    });
    // Aquí haces fetch o actualizas el estado con resultados filtrados
  };

  // Por ahora usamos el mock. Idealmente acá irían los resultados filtrados:
  const rows = MOCK_ROWS;

  return (
    <AdminLayout>
      {/* migas / breadcrumb */}
      <div className="text-xs text-gray-500 mb-2">
        Dashboard / Auditoría de Evaluaciones
      </div>

      {/* contenedor principal tipo card */}
      <section className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
        {/* Título */}
        <h1 className="text-base font-semibold text-gray-800 text-center">
          Auditoría de Evaluaciones
        </h1>

        {/* Filtros */}
        <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>Filtros:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            {/* Usuario */}
            <div className="flex flex-col">
              <label
                htmlFor="filtroUsuario"
                className="text-[11px] font-medium text-gray-600 mb-1"
              >
                Usuario
              </label>
              <select
                id="filtroUsuario"
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="maria">María Pérez</option>
                <option value="carlos">Carlos Rojas</option>
              </select>
            </div>

            {/* Área */}
            <div className="flex flex-col">
              <label
                htmlFor="filtroArea"
                className="text-[11px] font-medium text-gray-600 mb-1"
              >
                Área
              </label>
              <select
                id="filtroArea"
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="ventas">Quimica</option>
                <option value="atc">Matematicas</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="flex flex-col">
              <label
                htmlFor="filtroFecha"
                className="text-[11px] font-medium text-gray-600 mb-1"
              >
                Fecha
              </label>
              <input
                id="filtroFecha"
                type="date"
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>

            {/* Botón Buscar */}
            <div className="flex sm:col-span-2 sm:justify-start">
              <button
                onClick={handleBuscar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-gray-800 text-white text-sm font-medium px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700">
            Tabla de Evaluaciones
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-gray-300 shadow-sm">
            <table className="table-auto w-full border-collapse text-sm text-gray-800">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Hora
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Competidor
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Área
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Nota Actual
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    Nota Nueva
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    OBS.
                  </th>
                </tr>
              </thead>

              {/* Cuerpo de la tabla */}
              <tbody>
                {/* Caso: sin registros */}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-gray-500 py-10 text-sm"
                    >
                      Sin registros
                    </td>
                  </tr>
                )}

                {/* Caso: hay registros */}
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors align-top"
                  >
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {r.usuario}
                    </td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {r.fecha}
                    </td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {r.hora}
                    </td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {r.competidor}
                    </td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {r.area}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-center">
                      {r.notaActual}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-center font-semibold">
                      {r.notaNueva}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-xs leading-snug max-w-[220px]">
                      {r.obs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Barra de acciones (Exportar) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="text-[11px] text-gray-500">
              {rows.length} registro(s) encontrados
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center justify-center rounded-md border border-gray-400 bg-white text-gray-700 text-xs font-medium px-3 py-2 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Exportar Excel
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-900 text-white text-xs font-medium px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
