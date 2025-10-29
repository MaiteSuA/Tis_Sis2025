import React from "react";

const RevisarEvaluaciones = () => {
  const competidores = [
    { nombre: "Juan José Villa Nueva", estado: "Calificado" },
    { nombre: "María José Serrudo", estado: "No calificado" },
    { nombre: "Grissell Coca Cadima", estado: "No calificado" },
    { nombre: "Carla Villarroel Mendieta", estado: "No calificado" },
    { nombre: "José Alba Tierra", estado: "Calificado" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Panel principal */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {/* Encabezado */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Área: Química</h2>
            <p className="text-gray-500">Estado: Pendiente de Cierre</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Ver Reporte
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              Responsable
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Resumen</h3>
            <ul className="text-gray-700">
              <li>Competidores: 40</li>
              <li>Clasificados: 12</li>
              <li>Evaluaciones: 22</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Cierre de Fase</h3>
            <ul className="text-gray-700 space-y-1">
              <li>✅ Todas las evaluaciones registradas</li>
              <li>✅ No existen pendientes</li>
              <li>✅ Se han revisado observaciones</li>
            </ul>
            <button className="mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Concluir Fase
            </button>
          </div>
        </div>

        {/* Tabla de resultados */}
        <h3 className="text-lg font-bold mb-3">Resultados Clasificatoria</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Competidor</th>
                <th className="p-3 text-left">Nota</th>
                <th className="p-3 text-left">Observaciones</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {competidores.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.nombre}</td>
                  <td className="p-3">Evaluaciones</td>
                  <td className="p-3 text-gray-400">--------</td>
                  <td className="p-3">{item.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones inferiores */}
        <div className="flex flex-wrap justify-between mt-6">
          <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Exportar Excel
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              Autorizar Publicación
            </button>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Registrar Evaluador
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisarEvaluaciones;