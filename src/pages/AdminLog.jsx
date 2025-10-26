import AdminLayout from "../components/AdminLayout.jsx";
export default function AdminLog() {
  return (
    <AdminLayout>
      <div className="text-sm text-gray-600 mb-2">Dashboard / Log de Cambios</div>

      <section className="panel space-y-4">
        <h1 className="section">Registro de Cambios en Evaluaciones</h1>

        <p className="text-gray-700">
          Aquí se mostrarán los registros de auditoría (usuarios, fecha, hora, acción realizada, etc.).
        </p>

        <div className="mt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Usuario</th>
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Acción</th>
                <th className="py-2 px-3">Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3">María Pérez</td>
                <td className="py-2 px-3">2025-10-25 18:45</td>
                <td className="py-2 px-3">Modificó evaluación</td>
                <td className="py-2 px-3">Nota 85 → 90</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Carlos Rojas</td>
                <td className="py-2 px-3">2025-10-25 18:50</td>
                <td className="py-2 px-3">Añadió observación</td>
                <td className="py-2 px-3">“Excelente desempeño”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}