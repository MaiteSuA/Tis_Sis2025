// src/pages/Medallero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// AJUSTA esta URL a tu backend real
const API_MEDALLERO = "http://localhost:3000/api/publico/medallero";

export default function Medallero() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const resp = await fetch(API_MEDALLERO);
        if (!resp.ok) {
          throw new Error("No se pudo obtener el medallero");
        }

        const data = await resp.json();
        const arr = Array.isArray(data) ? data : [];

        setDocs(arr);
        setSelectedIndex(arr.length > 0 ? 0 : -1);
      } catch (e) {
        console.error(e);
        setError(
          e.message || "Ocurrió un error al cargar los documentos del medallero."
        );
        setDocs([]);
        setSelectedIndex(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hayDocumentos = docs.length > 0;
  const current = hayDocumentos && selectedIndex >= 0 ? docs[selectedIndex] : null;

  const esPdf = (doc) =>
    doc?.tipo_archivo === "application/pdf" ||
    doc?.nombre_archivo?.toLowerCase().endsWith(".pdf");

  const esImagen = (doc) =>
    doc?.tipo_archivo?.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".gif", ".webp"].some((ext) =>
      doc?.nombre_archivo?.toLowerCase().endsWith(ext)
    );

  const handleDescargar = () => {
    if (!current) return;
    window.open(current.url_archivo, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Medallero oficial
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Aquí se muestran todos los documentos oficiales
          
        </p>

        {loading && (
          <div className="mt-4 text-gray-600 text-sm">
            Cargando documentos…
          </div>
        )}

        {error && (
          <div className="mt-4 mb-4 px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {!loading && !hayDocumentos && !error && (
          <p className="mt-4 text-gray-600">
            Aún no hay documentos de medallero publicados.
          </p>
        )}

        {hayDocumentos && (
          <section className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lista de documentos */}
            <div className="md:col-span-1">
              <h2 className="text-sm font-semibold mb-2">
                Documentos publicados
              </h2>
              <ul className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {docs.map((doc, idx) => (
                  <li key={doc.id_archivo || idx}>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left text-xs px-2 py-2 rounded-md border transition ${
                        idx === selectedIndex
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <span className="block truncate font-medium">
                        {doc.nombre_archivo || `Documento ${idx + 1}`}
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        {doc.tipo_archivo || "tipo desconocido"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vista previa */}
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold mb-2">Vista previa</h2>

              {!current && (
                <div className="w-full h-[65vh] flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                  No hay documento seleccionado.
                </div>
              )}

              {current && (
                <div className="w-full h-[65vh] border rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
                  {esPdf(current) ? (
                    <iframe
                      src={current.url_archivo}
                      title={current.nombre_archivo || "Documento"}
                      className="w-full h-full"
                    />
                  ) : esImagen(current) ? (
                    <img
                      src={current.url_archivo}
                      alt={current.nombre_archivo}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-600">
                      Vista previa no disponible para este tipo de archivo.
                      <br />
                      Puedes descargarlo para verlo:
                      <br />
                      <span className="font-mono text-xs">
                        {current.nombre_archivo}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Botones */}
              <div className="mt-4 flex flex-wrap gap-3 justify-between md:justify-end">
                <button
                  type="button"
                  onClick={handleDescargar}
                  disabled={!current}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descargar
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-200"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
