// src/pages/ResponsableAnuncios.jsx
import { useEffect, useState } from "react";
import { crearAnuncioCarrusel, getAnunciosCarrusel } from "../api/anuncios";

export default function ResponsableAnuncios() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenAlt, setImagenAlt] = useState("");
  const [orden, setOrden] = useState(1);
  const [pubDate, setPubDate] = useState("");
  const [expDate, setExpDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [anuncios, setAnuncios] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // Cargar anuncios del carrusel al entrar
  const cargarAnuncios = async () => {
    try {
      setLoadingList(true);
      setError("");
      const data = await getAnunciosCarrusel();
      setAnuncios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los anuncios actuales.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    cargarAnuncios();
  }, []);

  const resetForm = () => {
    setTitulo("");
    setContenido("");
    setImagenUrl("");
    setImagenAlt("");
    setOrden(1);
    setPubDate("");
    setExpDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOkMsg("");

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

      setOkMsg(" Anuncio guardado correctamente.");
      resetForm();
      await cargarAnuncios();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Gestión de anuncios del carrusel
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Aquí puedes registrar y revisar los anuncios que se muestran en el
          carrusel de la página de inicio.
        </p>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded-md bg-red-50 border border-red-300 text-red-700">
            {error}
          </div>
        )}
        {okMsg && (
          <div className="mb-4 text-sm px-3 py-2 rounded-md bg-green-50 border border-green-300 text-green-700">
            {okMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FORMULARIO */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-4">
              Nuevo anuncio del carrusel
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Vista previa rápida de la imagen */}
              {imagenUrl && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">
                    Vista previa de la imagen:
                  </p>
                  <div className="w-full h-40 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      src={imagenUrl}
                      alt={imagenAlt || titulo || "Previsualización"}
                      className="max-h-full max-w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x200?text=Imagen+no+válida";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Limpiar
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
          </section>

          {/* LISTADO / DASHBOARD */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Anuncios actuales</h2>
              <button
                type="button"
                onClick={cargarAnuncios}
                disabled={loadingList}
                className="text-xs px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                {loadingList ? "Actualizando..." : "Actualizar"}
              </button>
            </div>

            {anuncios.length === 0 && !loadingList && (
              <p className="text-sm text-gray-500">
                No hay anuncios registrados aún.
              </p>
            )}

            {anuncios.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 border">Orden</th>
                      <th className="px-2 py-1 border">Título</th>
                      <th className="px-2 py-1 border">Desde</th>
                      <th className="px-2 py-1 border">Hasta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anuncios.map((a) => (
                      <tr key={a.id_anuncio || a.id || `${a.titulo}-${a.orden}`}>
                        <td className="px-2 py-1 border text-center">
                          {a.orden ?? "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          <div className="font-semibold truncate max-w-[180px]">
                            {a.titulo}
                          </div>
                          {a.contenido && (
                            <div className="text-[11px] text-gray-500 truncate max-w-[180px]">
                              {a.contenido}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {a.fecha_publicacion
                            ? String(a.fecha_publicacion).slice(0, 10)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {a.fecha_expiracion
                            ? String(a.fecha_expiracion).slice(0, 10)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
