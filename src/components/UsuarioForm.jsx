// Importa los hooks de React: useEffect (efectos secundarios) y useState (manejo de estado local)
import { useEffect, useState } from "react";
// Lista de roles posibles para el usuario
const ROLES = ["RESPONSABLE", "COORDINADOR"];
// Componente principal del formulario de usuario
export default function UsuarioForm({
  mode = "create",
  title = "Registro de Usuario",
  areas = [],
  initialData,
  defaultRol = "RESPONSABLE",
  onSubmit,
  onCancel,
}) {
    // Verifica si el formulario está en modo edición
  const isEdit = mode === "edit";
  // Estado local para guardar todos los campos del formulario
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    rol: defaultRol,
    areaId: areas[0]?.id ?? 0,// por defecto la primera área
    area: areas[0]?.nombre ?? "",
    correo: "",
    telefono: "",
    carnet: "",
    activo: true,
  });
 
  // Hook useEffect: se ejecuta cuando el componente se monta o cambia algún dato dependiente
  // Su función es precargar los datos si el formulario está en modo edición

  // Pre-cargar datos cuando se edita
  useEffect(() => {
    if (isEdit && initialData) {
      // Busca el área correspondiente al nombre en los datos iniciales
      const areaId =
        areas.find((a) => a.nombre === initialData.area)?.id ??
        areas[0]?.id ??
        0;
       // Carga los valores del usuario que se va a editar
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
      // valores por defecto para crear
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

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
// Función que maneja el envío del formulario
  const submit = (e) => {
    //e.preventDefault();
    //onSubmit(form);
    e.preventDefault();// Evita recargar la página
    console.log("📦 Datos enviados al backend:", form); // 👈 LOG del contenido del formulario
    onSubmit(form);// Llama a la función que se pasa desde el componente padre
  };

  return (
    // Contenedor que cubre toda la pantalla para mostrar el formulario tipo modal
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       {/* Fondo semitransparente para oscurecer detrás del modal */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
       {/* Formulario principal */}
      <form onSubmit={submit} className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
           {/* Estructura en dos columnas para los campos */}
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
           {/* Campo: Nombres */}
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
          {/* Campo: Correo electrónico */}
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
            {/* Campo: Rol */}
          <div>
            <label className="text-sm text-gray-600">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => set("rol", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            >
              {/* Genera las opciones a partir del array ROLES */}
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
           {/* Campo: Área */}
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
              {/* Muestra todas las áreas disponibles */}
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Checkbox: estado activo o inactivo */}
          <label className="col-span-2 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set("activo", e.target.checked)}
              disabled={!isEdit} // 👈 solo se puede modificar en modo edición
              className={!isEdit ? "opacity-60 cursor-not-allowed" : ""}
            />
            <span>
              Activo
              {!isEdit && (
                <span className="text-xs text-gray-500 ml-1">
                </span>
              )}
            </span>
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
