export default function UsuariosTable({ rows = [], onEdit, onDelete }) {
  // Helper para iniciales: primer nombre + primer apellido
  const getInitials = (nombres = "", apellidos = "") => {
    const n = (nombres || "").trim().split(/\s+/)[0] || "";
    const a = (apellidos || "").trim().split(/\s+/)[0] || "";
    return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase() || "-";
  };

  const headers = [
    "Usuario",
    "Nombres",
    "Apellidos",
    "Rol",
    "Área",
    "Estado",
    "Gmail",
    "Acciones",
  ];

  return (
    <div className="relative">
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-400 shadow-sm">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="text-center text-gray-500 py-6" colSpan={headers.length}>
                  Sin registros
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                {/* Nueva columna: iniciales */}
                <td className="px-4 py-2 font-semibold">
                  {r.nombreUsuario ?? getInitials(r.nombres, r.apellidos)}
                </td>

                <td className="px-4 py-2">{r.nombres}</td>
                <td className="px-4 py-2">{r.apellidos ?? "-"}</td>
                <td className="px-4 py-2">{r.rol}</td>
                <td className="px-4 py-2">{r.area}</td>

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {r.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-4 py-2">{r.correo}</td>

                <td className="px-4 py-2">
                  <div className="flex justify-end items-center gap-2">
                    {/* ✅ pasa la fila completa para pre-rellenar el formulario */}
                    <button
                      onClick={() => onEdit?.(r)}
                      className="btn-light px-3 py-1 rounded-md inline-flex items-center gap-1 hover:bg-gray-200 transition-colors"
                      aria-label="Editar usuario"
                    >
                      <span aria-hidden>✎</span>
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onDelete?.(r.id)}
                      className="btn-dark px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Eliminar
                    </button>
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
