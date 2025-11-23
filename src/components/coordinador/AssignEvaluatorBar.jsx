// src/components/AssignEvaluatorBar.jsx
export default function AssignEvaluatorBar({
  evaluadores = [],
  value,
  onChange,
  onSend,
  disabled = false,
  count = 0,
}) {
  return (
    <div className="card px-4 py-3 flex flex-wrap items-center gap-3">
      <select
        className="input w-72"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Evaluador de Área</option>
        {evaluadores.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.area} — {ev.nombre}
          </option>
        ))}
      </select>

      <button
        className="btn btn-primary"
        onClick={onSend}
        disabled={disabled}
        title={!value ? "Selecciona un evaluador" : ""}
      >
        Enviar
      </button>

      <span className="text-sm text-gray-600">
        {count} fila(s) a enviar
      </span>
    </div>
  );
}
