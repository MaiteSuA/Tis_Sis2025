export default function UsuariosTable({ rows = [], onEdit, onDelete }) {
  const headers = ["Nombres","Apellidos","Rol","Área","Estado","Gmail","Acciones"];

  return (
    <div className="relative">
      <button className="btn-light p-2 absolute top-2 left-2">✎</button>
      {/* Botón “lápiz” arriba-derecha como en el mock (opcional) */}
      <button aria-label="Editar cabecera" className="btn-light p-2 absolute top-2 right-2">✎</button>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-400">
        <table className="table-grid">
          <thead>
            <tr>{headers.map(h => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td className="td text-center text-gray-500 py-6" colSpan={headers.length}>Sin registros</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.id}>
                <td className="td">{r.nombres}</td>
                <td className="td">{r.apellidos ?? "-"}</td>
                <td className="td">{r.rol}</td>
                <td className="td">{r.area}</td>
                <td className="td">
                  <span className={`px-2 py-1 rounded-full text-xs ${r.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {r.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="td">{r.correo}</td>
                <td className="td">
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => onEdit?.(r.id)} className="btn-light px-3 py-1">Editar</button>
                    <button onClick={() => onDelete?.(r.id)} className="btn-dark px-3 py-1">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
