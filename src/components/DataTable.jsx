export default function DataTable({ rows = [] }) {
  const headers = [
    "Nombres","Apellidos","CI","Colegio","Contacto_Tutor","Unidad_Educativa",
    "Departamento","Grado_Escolaridad","Área","Tutor_Académico"
  ];

  return (
    <div className="card overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-sm text-gray-500">
                (Previsualización vacía)
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                {headers.map(h => (
                  <td key={h} className="px-4 py-2 text-sm">{r[h] ?? ""}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
