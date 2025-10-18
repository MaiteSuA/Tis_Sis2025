import { useState } from "react";

export default function UsuarioForm({ title, areas, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    areaId: areas[0]?.id ?? 0,
    activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Nombres</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              required
            />
          </div>
          <div>
            <label className="text-sm">Apellidos</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            />
          </div>
          <div>
            <label className="text-sm">Correo</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              required
            />
          </div>
          <div>
            <label className="text-sm">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Área</label>
            <select
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              name="activo"
              type="checkbox"
              checked={form.activo}
              onChange={handleChange}
            />
            <label>Activo</label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}