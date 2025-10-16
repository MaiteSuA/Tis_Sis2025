import { useState } from "react";

export default function RegistrarNotas() {
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, competidor: "Juan Pérez", nota: "", observacion: "", estado: "Pendiente" },
    { id: 2, competidor: "Ana García", nota: "", observacion: "", estado: "Pendiente" },
  ]);

  const [mensaje, setMensaje] = useState("");

  const handleNotaChange = (id, valor) => {
    // Validar que sea un número real entre 0.0 y 100.0
    if (valor === "" || (/^\d{0,3}(\.\d{0,2})?$/.test(valor) && valor >= 0 && valor <= 100)) {
      const nuevas = evaluaciones.map((e) =>
        e.id === id ? { ...e, nota: valor } : e
      );
      setEvaluaciones(nuevas);
    }
  };

  const handleObservacionChange = (id, texto) => {
    const nuevas = evaluaciones.map((e) =>
      e.id === id ? { ...e, observacion: texto } : e
    );
    setEvaluaciones(nuevas);
  };

  const guardarCambios = () => {
    const ahora = new Date().toLocaleString();
    const evaluador = "Evaluador Demo"; // esto luego vendría del login

    console.log("Notas registradas:", evaluaciones);

    setMensaje(`✅ Cambios guardados correctamente el ${ahora} por ${evaluador}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        Lista de Evaluaciones - Clasificatoria
      </h2>

      <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">N°</th>
            <th className="p-2 border">Competidor</th>
            <th className="p-2 border">Nota</th>
            <th className="p-2 border">Observación</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((e, i) => (
            <tr key={e.id}>
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{e.competidor}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  step="0.1"
                  value={e.nota}
                  onChange={(ev) => handleNotaChange(e.id, ev.target.value)}
                  className="w-20 p-1 border rounded text-center"
                  min="0"
                  max="100"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={e.observacion}
                  onChange={(ev) => handleObservacionChange(e.id, ev.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2 border">{e.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={guardarCambios}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Guardar cambios
        </button>
      </div>

      {mensaje && (
        <p className="text-green-600 mt-4 text-center font-medium">{mensaje}</p>
      )}
    </div>
  );
}
