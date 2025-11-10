export default function UsuariosTable({ rows = [], onEdit, onDelete }) {
  // Helper para iniciales: primer nombre + primer apellido
  const getInitials = (nombres = "", apellidos = "") => {
    // Toma el primer token (palabra) de nombres y apellidos
    const n = (nombres || "").trim().split(/\s+/)[0] || "";
    const a = (apellidos || "").trim().split(/\s+/)[0] || "";
    // Validación defensiva de rows (no se usa aquí, pero previene errores si se necesitara)
    const safeRows = Array.isArray(rows) ? rows : [];
    // Devuelve iniciales en mayúsculas o "-" si está vacío
    return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase() || "-";
  };

  // Encabezados visibles de la tabla; su orden define el layout de columnas
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
    // Contenedor relativo para manejar posiciones internas (por ej. sombras, overlays)
    <div className="relative">
      {/* Contenedor con scroll horizontal si se desborda y estilizado como tarjeta */}
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-400 shadow-sm">
        {/* Tabla responsiva con ancho completo y colapsado de bordes */}
        <table className="table-auto w-full border-collapse">
          {/* Encabezado de la tabla */}
          <thead className="bg-gray-100 border-b">
            <tr>
              {/* Render de encabezados a partir del array 'headers' */}
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
            {/* Estado vacío: cuando no hay filas, muestra un solo renglón con mensaje */}
            {rows.length === 0 && (
              <tr>
                <td className="text-center text-gray-500 py-6" colSpan={headers.length}>
                  Sin registros
                </td>
              </tr>
            )}

            {/* Recorre cada fila y dibuja un <tr> por usuario */}
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">

                {/* Nueva columna: iniciales */}
                {/* Muestra 'nombreUsuario' si viene del backend; si no, calcula iniciales */}
                <td className="px-4 py-2 font-semibold">
                  {r.nombreUsuario ?? getInitials(r.nombres, r.apellidos)}
                </td>

                {/* Columnas de datos simples: lectura directa de propiedades */}
                <td className="px-4 py-2">{r.nombres}</td>
                <td className="px-4 py-2">{r.apellidos ?? "-"}</td>
                <td className="px-4 py-2">{r.rol}</td>

                {/* Área puede venir como string o como objeto; se cubren ambos casos */}
                <td className="px-4 py-2">
                  {typeof r.area === "string"
                  ? r.area
                  : r.area?.nombre_area ?? "-"}
                </td>

                {/* Badge de estado: cambia color según activo/inactivo */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {r.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Correo del usuario */}
                <td className="px-4 py-2">{r.correo}</td>

                {/* Columna de acciones (editar / eliminar) alineadas a la derecha */}
                <td className="px-4 py-2">
                  <div className="flex justify-end items-center gap-2">
                    {/* pasa la fila completa para pre-rellenar el formulario */}
                    {/* Botón editar: llama al callback 'onEdit' si fue provisto */}
                    <button
                      onClick={() => onEdit?.(r)}
                      className="btn-light px-3 py-1 rounded-md inline-flex items-center gap-1 hover:bg-gray-200 transition-colors"
                      aria-label="Editar usuario"
                    >
                      <span aria-hidden>✎</span>
                      <span>Editar</span>
                    </button>

                    {/* Botón eliminar: delega la acción al componente padre vía 'onDelete' */}
                    <button
                      type="button"
                      onClick={() => onDelete?.(r)}
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
