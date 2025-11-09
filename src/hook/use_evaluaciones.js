import { useState } from "react";

const useEvaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, competidor: "", nota: "", observacion: "", estado: "Pendiente" },
  ]);
  const [errorValidacion, setErrorValidacion] = useState({});

  const validarNota = (nota) => {
    if (nota === "") return true;
    const num = Number(nota);
    return Number.isFinite(num) && num >= 0 && num <= 100;
  };

  const onCellChange = (id, field, value) => {
    if (field === "nota") {
      if (!validarNota(value)) {
        setErrorValidacion((prev) => ({
          ...prev,
          [id]: "La nota debe ser un número entre 0 y 100",
        }));
      } else {
        setErrorValidacion((prev) => ({ ...prev, [id]: "" }));
      }
    }
    setEvaluaciones((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const onDeleteRow = (id) => {
    setEvaluaciones((prev) =>
      prev.length > 1 ? prev.filter((r) => r.id !== id) : prev
    );
  };

  const agregarFila = () => {
    const nuevoId = Math.max(0, ...evaluaciones.map((e) => e.id)) + 1;
    setEvaluaciones((prev) => [
      ...prev,
      { id: nuevoId, competidor: "", nota: "", observacion: "", estado: "Pendiente" },
    ]);
  };

  return { evaluaciones, errorValidacion, onCellChange, onDeleteRow, agregarFila };
};

export default useEvaluaciones;
