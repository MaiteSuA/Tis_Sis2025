export default function FilterBar({ areas, niveles, filters, onChange }) {
  const handleAreaChange = (e) =>
    onChange({ ...filters, area: e.target.value || null });

  const handleNivelChange = (e) =>
    onChange({ ...filters, nivel: e.target.value || null });

  return (
    <div className="card px-4 py-3 flex flex-wrap gap-4 items-end">
      {/* Área */}
      <div>
        <label className="label">Área</label>
        <select
          className="input w-full"
          value={filters.area || ""}
          onChange={handleAreaChange}
        >
          <option value="">Todas</option>
          {areas.map((a) => (
            <option
              key={a.id_area}
              value={a.nombre_area ?? a.nombre}
            >
              {a.nombre_area ?? a.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Nivel */}
      <div>
        <label className="label">Nivel</label>
        <select
          className="input w-full"
          value={filters.nivel || ""}
          onChange={handleNivelChange}
        >
          <option value="">Todos</option>
          {niveles.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
