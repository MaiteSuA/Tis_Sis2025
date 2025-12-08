// src/components/AnuncioCarruselModal.jsx
import { useEffect, useState } from "react";
//import { crearAnuncioCarrusel } from "../api/anuncios";
// Asegurarse de importar la función crearAnuncioCarrusel
export default function AnuncioCarruselModal({ open, onClose, onSaved }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenAlt, setImagenAlt] = useState("");
  const [orden, setOrden] = useState(1);
  const [pubDate, setPubDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
//ordem importar la función crearAnuncioCarrusel
  useEffect(() => {
    if (!open) {
      setTitulo("");
      setContenido("");
      setImagenUrl("");
      setImagenAlt("");
      setOrden(1);
      setPubDate("");
      setExpDate("");
      setError("");
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await crearAnuncioCarrusel({
        titulo,
        contenido,
        imagen_url: imagenUrl,
        imagen_alt: imagenAlt,
        orden: Number(orden) || 1,
        fecha_publicacion: pubDate || null,
        fecha_expiracion: expDate || null,
      });

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">Nuevo anuncio del carrusel</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción / contenido corto
            </label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de la imagen
            </label>
            <input
              type="text"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="https://..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta imagen se mostrará de fondo en el carrusel.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Texto alternativo de la imagen
            </label>
            <input
              type="text"
              value={imagenAlt}
              onChange={(e) => setImagenAlt(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Orden
              </label>
              <input
                type="number"
                min={1}
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publicar desde
              </label>
              <input
                type="date"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expira (opcional)
              </label>
              <input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar anuncio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

