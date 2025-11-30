import { useEffect, useState } from "react";

function validarPuntajes(p) {
  const { oro, plata, bronce } = p;

  if (bronce <= 0) {
    return "El puntaje mínimo de Bronce debe ser mayor que 0.";
  }
  if (oro <= plata) {
    return "El puntaje mínimo de Oro debe ser mayor que el de Plata.";
  }
  if (plata <= bronce) {
    return "El puntaje mínimo de Plata debe ser mayor que el de Bronce y menor que el de Oro.";
  }
  if (oro <= bronce) {
    return "El puntaje mínimo de Oro debe ser mayor que el de Bronce.";
  }
  return "";
}

export default function MedallasModal({ areas, data, onSave, onClose }) {
  const [selectedAreaId, setSelectedAreaId] = useState(
    areas[0]?.id ?? null
  );
  const [localData, setLocalData] = useState({});
  const [error, setError] = useState("");

  // copiar datos iniciales
  useEffect(() => {
    setLocalData(data || {});
  }, [data]);

  // asegurar que siempre haya un área seleccionada
  useEffect(() => {
    if (!selectedAreaId && areas.length > 0) {
      setSelectedAreaId(areas[0].id);
    }
  }, [areas, selectedAreaId]);

  // recalcular error cuando cambie el área o los datos
  useEffect(() => {
    if (!selectedAreaId) return;
    const entry = localData[selectedAreaId] || {};
    const puntajes = entry.puntajes || { oro: 0, plata: 0, bronce: 0 };
    setError(validarPuntajes(puntajes));
  }, [selectedAreaId, localData]);

  const entry = localData[selectedAreaId] || {};
  const cantidades = entry.cantidades || { oro: 0, plata: 0, bronce: 0 };
  const puntajes = entry.puntajes || { oro: 0, plata: 0, bronce: 0 };

  const handleCantidadChange = (medalla) => (e) => {
    const val = Math.max(0, Number(e.target.value || 0));

    setLocalData((prev) => {
      const anterior = prev[selectedAreaId] || {};
      const prevCant = anterior.cantidades || cantidades;
      const prevPunt = anterior.puntajes || puntajes;

      return {
        ...prev,
        [selectedAreaId]: {
          cantidades: { ...prevCant, [medalla]: val },
          puntajes: prevPunt,
        },
      };
    });
  };

  const handlePuntajeChange = (medalla) => (e) => {
    const val = Math.max(0, Number(e.target.value || 0));

    setLocalData((prev) => {
      const anterior = prev[selectedAreaId] || {};
      const prevCant = anterior.cantidades || cantidades;
      const prevPunt = anterior.puntajes || puntajes;

      const nuevosPuntajes = { ...prevPunt, [medalla]: val };
      setError(validarPuntajes(nuevosPuntajes));

      return {
        ...prev,
        [selectedAreaId]: {
          cantidades: prevCant,
          puntajes: nuevosPuntajes,
        },
      };
    });
  };

  const handleSaveClick = () => {
    if (error) return;
    onSave(localData);
  };

  if (!selectedAreaId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Parametrizar medallas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* selector de área */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-700">Área:</span>
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(Number(e.target.value))}
            className="kpi-input min-w-[180px]"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* cantidades */}
        <div className="border rounded-lg p-4 mb-4">
          <p className="font-semibold text-sm text-gray-800 mb-3">
            Cantidad de medallas para esta área
          </p>
          <div className="flex flex-wrap gap-6">
            {["oro", "plata", "bronce"].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-16 capitalize text-gray-700">
                  {key}:
                </span>
                <input
                  type="number"
                  min={0}
                  className="kpi-input w-24"
                  value={cantidades[key]}
                  onChange={handleCantidadChange(key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* puntajes */}
        <div className="border rounded-lg p-4 mb-4">
          <p className="font-semibold text-sm text-gray-800 mb-3">
            Puntaje mínimo por medalla
          </p>
          <div className="flex flex-wrap gap-6">
            {["oro", "plata", "bronce"].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-16 capitalize text-gray-700">
                  {key}:
                </span>
                <input
                  type="number"
                  min={0}
                  className="kpi-input w-24"
                  value={puntajes[key]}
                  onChange={handlePuntajeChange(key)}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* botones */}
        <div className="flex justify-end gap-3 mt-2">
          <button className="btn-light" onClick={onClose}>
            Cerrar
          </button>
          <button
            className={`btn-dark ${
              error ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleSaveClick}
            disabled={!!error}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
