export default function FilterBar({ areas, niveles, filters, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium">Filtros</div>

      <select
        value={filters.area ?? ""}
        onChange={(e) => onChange({ ...filters, area: e.target.value || null })}
        className="input w-40"
      >
        <option value="">Área (todas)</option>
        {areas.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        value={filters.nivel ?? ""}
        onChange={(e) => onChange({ ...filters, nivel: e.target.value || null })}
        className="input w-44"
      >
        <option value="">Nivel (todos)</option>
        {niveles.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}
