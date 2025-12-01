import React, { useEffect, useState } from "react";
import Header from "../components/headerR";

export default function Resultados() {
  const [publicado, setPublicado] = useState(
    localStorage.getItem("publicado") === "true"
  );

  const [competidores, setCompetidores] = useState([]);

  useEffect(() => {
    if (!publicado) return;

    const fetchData = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/evaluaciones`);
      const result = await response.json();
      if (result.ok) setCompetidores(result.data);
    };

    fetchData();
  }, [publicado]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Resultados 
        </h1>

        {!publicado ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-600 text-lg">
              <strong>Aún no se han publicado los resultados.</strong>
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Resultados Clasificatoria</h2>

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
                  {competidores.map((c, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{c.competidor}</td>
                      <td className="p-3">{c.nota}</td>
                      <td className="p-3">{c.observacion}</td>
                      <td className="p-3">{c.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mt-10 text-gray-500">
              Resultados Final (Pendiente)
            </h2>
            <p className="text-gray-500 text-sm">
              Esta sección aún no está implementada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
