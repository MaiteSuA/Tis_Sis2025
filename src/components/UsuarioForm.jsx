// Importa los hooks de React: useEffect y useState
import { useEffect, useState } from "react";

// Define los roles disponibles para el usuario
const ROLES = ["RESPONSABLE", "EVALUADOR"];

// Componente principal del formulario de usuario
export default function UsuarioForm({
  mode = "create",                    // modo: "create" o "edit"
  title = "Registro de Usuario",      // título del formulario
  areas = [],                         // lista de áreas disponibles
  initialData,                        // datos iniciales
  defaultRol = "RESPONSABLE",         // rol predeterminado
  onSubmit,                           // función a ejecutar al enviar
  onCancel,                           // función a ejecutar al cancelar
}) {
  const isEdit = mode === "edit";     // determina si el formulario está en modo edición

  // Estado principal del formulario con valores iniciales
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    rol: defaultRol,
    areaId: areas[0]?.id ?? 0,
    area: areas[0]?.nombre ?? "",
    correo: "",
    telefono: "",
    carnet: "",
    activo: true,
  });

  /* ================================================================
     useEffect: carga o reinicia los valores del formulario
     - Si está en modo edición, precarga los datos del usuario.
     - Si no, reinicia con valores por defecto.
  ================================================================= */
  useEffect(() => {
    if (isEdit && initialData) {
      // Busca el ID del área según el nombre del área en los datos iniciales
      const areaId =
        areas.find((a) => a.nombre === initialData.area)?.id ??
        areas[0]?.id ??
        0;
      
      // Carga los valores existentes en el formulario
      setForm({
        nombres: initialData.nombres ?? "",
        apellidos: initialData.apellidos ?? "",
        rol: initialData.rol ?? defaultRol,
        areaId,
        area: initialData.area ?? (areas.find((a) => a.id === areaId)?.nombre ?? ""),
        correo: initialData.correo ?? "",
        telefono: initialData.telefono ?? "",
        carnet: initialData.carnet ?? "",
        activo: typeof initialData.estado === "boolean" ? initialData.estado : true,
      });
    } else {
      // Reinicia el formulario con valores por defecto
      setForm((f) => ({
        ...f,
        rol: defaultRol,
        areaId: areas[0]?.id ?? 0,
        area: areas[0]?.nombre ?? "",
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        carnet: "",
        activo: true,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialData, defaultRol, JSON.stringify(areas)]);

  // Función auxiliar para actualizar una propiedad del formulario
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Función que maneja el envío del formulario
  const submit = (e) => {
    e.preventDefault();    // evita que la página se recargue
    console.log("Datos enviados al backend:", form); //  LOG del contenido del formulario
    onSubmit(form);        // llama a la función onSubmit pasando el formulario
  };

  // Renderizado del formulario
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form onSubmit={submit} className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Campo: Nombres */}
          <div>
            <label className="text-sm text-gray-600">Nombres</label>
            <input
              value={form.nombres}
              onChange={(e) => set("nombres", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Nombre"
              required
            />
          </div>

          {/* Campo: Carnet */}
          <div>
            <label className="text-sm text-gray-600">CI / Carnet</label>
            <input
              value={form.carnet}
              onChange={(e) => set("carnet", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Ej. 7890123"
              required
            />
          </div> 

          {/* Campo: Apellidos */}
          <div>
            <label className="text-sm text-gray-600">Apellidos</label>
            <input
              value={form.apellidos}
              onChange={(e) => set("apellidos", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Apellidos"
            />
          </div>

          {/* Campo: Correo */}
          <div>
            <label className="text-sm text-gray-600">Correo</label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => set("correo", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {/* Campo: Teléfono */}
          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <input
              value={form.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Teléfono"
            />
          </div>

          {/* Selector de Rol */}
          <div>
            <label className="text-sm text-gray-600">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => set("rol", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Área */}
          <div>
            <label className="text-sm text-gray-600">Área</label>
            <select
              value={form.areaId}
              onChange={(e) => {
                const id = Number(e.target.value);
                const a = areas.find((x) => x.id === id);
                setForm((prev) => ({ ...prev, areaId: id, area: a?.nombre ?? "" }));
              }}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox de Activo */}
          <label className="col-span-2 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set("activo", e.target.checked)}
            />
            Activo
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
