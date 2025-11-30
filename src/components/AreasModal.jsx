import { useState } from "react";

export default function AreasModal({
  areas = [],
  onCreate,
  onUpdate,
  onDelete,
  onClose,
}) {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  // Soporta tanto { id, nombre } como { id_area, nombre_area }
  const getId = (a) => a.id_area ?? a.id;
  const getNombre = (a) => a.nombre_area ?? a.nombre;

  const startEdit = (area) => {
    setEditId(getId(area));
    setEditNombre(getNombre(area) || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    onCreate?.(nombre);
    setNuevoNombre("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const nombre = editNombre.trim();
    if (!nombre || !editId) return;
    onUpdate?.(editId, nombre);
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (!confirm("¿Eliminar esta área?")) return;
    onDelete?.(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Gestionar Áreas</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-xl p-3 space-y-2">
          {areas.length === 0 && (
            <p className="text-sm text-gray-500">
              No hay áreas registradas todavía.
            </p>
          )}

          {areas.map((a) => {
            const id = getId(a);
            const nombre = getNombre(a);

            return (
              <div
                key={id}
                className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2"
              >
                {editId === id ? (
                  <form
                    onSubmit={handleUpdate}
                    className="flex items-center gap-2 flex-1"
                  >
                    <input
                      className="flex-1 px-2 py-1 rounded-lg border text-sm"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-black text-white text-xs"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-1 rounded-lg bg-gray-200 text-xs"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="text-sm text-gray-800 flex-1">
                      {nombre}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(a)}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs"
                      >
                        Renombrar
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="btn-dark px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleCreate} className="flex items-center gap-2 pt-2">
          <input
            className="flex-1 px-3 py-2 rounded-xl border text-sm"
            placeholder="Nueva área (ej. Sistemas)"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <button
            type="submit"
            className="btn-dark px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
}
