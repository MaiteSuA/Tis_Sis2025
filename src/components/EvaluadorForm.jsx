import { useEffect, useState } from "react";

// Lista de roles posibles (Se fija como 'EVALUADOR')
const ROLES = ["EVALUADOR"];

export default function UsuarioForm({
  mode = "create",
  title = "Registro de Evaluador",
  areas = [],
  initialData,
  defaultRol = "EVALUADOR", // 👈 ahora el rol por defecto es EVALUADOR
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  // Estado que guarda todos los datos del formulario
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

  // Si se edita, precarga los datos en el formulario
  useEffect(() => {
    if (isEdit && initialData) {
      const areaId =
        areas.find((a) => a.nombre === initialData.area)?.id ??
        areas[0]?.id ??
        0;

      setForm({
        nombres: initialData.nombres ?? "",
        apellidos: initialData.apellidos ?? "",
        rol: "EVALUADOR", // 👈 aseguramos que quede fijo
        areaId,
        area:
          initialData.area ??
          (areas.find((a) => a.id === areaId)?.nombre ?? ""),
        correo: initialData.correo ?? "",
        telefono: initialData.telefono ?? "",
        carnet: initialData.carnet ?? "",
        activo:
          typeof initialData.estado === "boolean"
            ? initialData.estado
            : true,
      });
    } else {
      setForm((f) => ({
        ...f,
        rol: "EVALUADOR", // 👈 fijo
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
  }, [isEdit, initialData, JSON.stringify(areas)]);

  // Función para actualizar valores del formulario
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Envía el formulario al padre (RevisarEvaluaciones)
  const submit = (e) => {
    e.preventDefault();
    console.log("📦 Datos enviados al backend:", form);
    onSubmit(form);
  };

  return (
    //Modal Flotante
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-registrar-evaluador">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      
      {/* Contenido del formulario */}
      <form
        onSubmit={submit}
        className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow space-y-4"
      >
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Campos del formulario */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Nombres</label>
            <input
              name="nombres"
              value={form.nombres}
              onChange={(e) => set("nombres", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Nombre"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">CI / Carnet</label>
            <input
              name="carnet"
              value={form.carnet}
              onChange={(e) => set("carnet", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Ej. 7890123"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={(e) => set("apellidos", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Apellidos"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Correo</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={(e) => set("correo", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              placeholder="Teléfono"
            />
          </div>

          {/* Rol fijo */}
          <div>
            <label className="text-sm text-gray-600">Rol</label>
            <input
              name="rol"
              value="EVALUADOR"
              disabled
              className="w-full mt-1 px-3 py-2 rounded-xl border bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Área</label>
            <select
              name="area"
              value={form.areaId}
              onChange={(e) => {
                const id = Number(e.target.value);
                const a = areas.find((x) => x.id === id);
                setForm((prev) => ({
                  ...prev,
                  areaId: id,
                  area: a?.nombre ?? "",
                }));
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

          {/* Checkbox para activar/desactivar */}
         
        </div>

        {/* Botones inferiores */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl !bg-gray-300 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl !bg-black text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
