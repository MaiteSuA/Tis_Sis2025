import { useEffect, useState } from "react";
import Header from "../components/header";

const API = import.meta.env.VITE_API_URL;

export default function AsignarFinalistas() {
  const [finalistas, setFinalistas] = useState([]);
  const [idFaseFinal, setIdFaseFinal] = useState(null);
  const [evaluadores, setEvaluadores] = useState([]);
  const [idEvaluador, setIdEvaluador] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      // Finalistas (con idFase)
      const r1 = await fetch(`${API}/clasificados/finalistas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j1 = await r1.json();
      setFinalistas(j1?.data ?? []);
      setIdFaseFinal(j1?.idFase ?? null);

      // Evaluadores del sistema (tu endpoint actual)
      const r2 = await fetch(`${API}/evaluadores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j2 = await r2.json();
      setEvaluadores(j2?.data ?? []);
    })();
  }, []);

  const asignar = async () => {
    if (!idEvaluador) return alert("Selecciona un evaluador");
    if (!finalistas.length) return alert("No hay finalistas");

    const idsInscritos = finalistas.map(f => Number(f.id_inscrito));
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/inscritos/asignar-evaluador`, {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        idEvaluador: Number(idEvaluador),
        idsInscritos,
        useFaseFinal: true,   // 👈 crea/upserta evaluaciones en fase final
        // idFase: idFaseFinal // (opcional: si quieres forzar por id)
      })
    });

    const json = await res.json();
    if (!res.ok || json?.ok === false) {
      return alert(json?.message || "Error al asignar");
    }
    alert(`Asignados ${idsInscritos.length} finalistas al evaluador #${idEvaluador} (fase final)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Asignar evaluaciones a FINALISTAS</h1>

        <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
          <label className="font-medium">Evaluador:</label>
          <select
            className="border rounded px-3 py-2"
            value={idEvaluador}
            onChange={(e) => setIdEvaluador(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {evaluadores.map(ev => (
              <option key={ev.id_evaluador || ev.id} value={ev.id_evaluador || ev.id}>
                {ev.nombre_evaluado
                  ? `${ev.nombre_evaluado} ${ev.apellidos_evaluador}`
                  : (ev.nombre || `Evaluador #${ev.id_evaluador || ev.id}`)}
              </option>
            ))}
          </select>

          <button
            onClick={asignar}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
          >
            Asignar a finalistas (fase final)
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Finalistas ({finalistas.length})</h2>
          <div className="max-h-96 overflow-auto text-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2">ID</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Colegio</th>
                </tr>
              </thead>
              <tbody>
                {finalistas.map(f => (
                  <tr key={f.id_clasificado} className="border-t">
                    <td className="py-1">{Number(f.id_inscrito)}</td>
                    <td>{f.inscritos?.nombres_inscrito || f.nombres || ""}</td>
                    <td>{f.inscritos?.apellidos_inscrito || f.apellidos || ""}</td>
                    <td>{f.inscritos?.colegio || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
