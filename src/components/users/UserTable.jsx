import { useEffect, useState } from "react";
import { ROLES } from "../../roles/roles";

export default function UserForm({ open, onClose, user, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", role: ROLES.EVALUADOR });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "", role: user.role || ROLES.EVALUADOR });
  }, [user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        <h2 className="text-lg font-semibold mb-3">{user ? "Editar usuario" : "Nuevo usuario"}</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Rol</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancelar</button>
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white"
            onClick={() => onSubmit(form)}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

