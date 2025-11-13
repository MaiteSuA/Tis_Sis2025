export default function DataTable({
  rows = [],
  selected = new Set(),
  onToggleRow,
  onToggleAll,
}) {
  const headers = [
    "Nombres","Apellidos","CI","Colegio","Contacto_Tutor","Unidad_Educativa",
    "Departamento","Grado_Escolaridad","Área","Tutor_Académico",
  ];

  const allSelected = rows.length > 0 && rows.every((_, i) => selected.has(i));

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </th>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="px-4 py-10 text-center text-gray-500">
                  (Previsualización vacía)
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => onToggleRow(i)}
                    />
                  </td>
                  {headers.map((h) => (
                    <td key={h} className="px-3 py-2">{r[h] ?? ""}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
