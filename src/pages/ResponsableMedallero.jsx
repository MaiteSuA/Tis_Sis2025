// src/pages/ResponsableDocumentosClasificados.jsx
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";

/* ---------- Vista previa CSV ---------- */
function CsvPreview({ file }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || "";
      const parsed = text
        .split(/\r?\n/)
        .filter((l) => l.trim() !== "")
        .map((l) => l.split(","));
      setRows(parsed);
    };
    reader.readAsText(file);
  }, [file]);

  if (!rows.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        CSV vacío o no legible.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-white p-2">
      <table className="min-w-full border text-xs md:text-sm">
        <tbody>
          {rows.map((r, ridx) => (
            <tr key={ridx}>
              {r.map((c, cidx) => (
                <td key={cidx} className="border px-2 py-1">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Vista previa Excel ---------- */
function ExcelPreview({ file }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      setHtml(XLSX.utils.sheet_to_html(ws));
    };
    reader.readAsBinaryString(file);
  }, [file]);

  if (!html) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Cargando vista previa de Excel...
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-auto bg-white p-3 text-xs md:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ---------- Vista previa DOCX usando docx-preview ---------- */
function DocxPreview({ file }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    file.arrayBuffer().then((buffer) => {
      renderAsync(buffer, containerRef.current);
    });
  }, [file]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-white p-3 text-xs md:text-sm docx-preview"
    />
  );
}

/* ---------- Página principal ---------- */
export default function ResponsableMedallero() {
  const [files, setFiles] = useState([]);       // archivos seleccionados
  const [previewIndex, setPreviewIndex] = useState(0); // cuál estoy previsualizando
  const [saving, setSaving] = useState(false); // estado de "Publicando..."
  const [message, setMessage] = useState("");  // mensaje de estado

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files || []);

    const enhanced = incoming.map((f) => ({
      file: f,
      name: f.name,
      type: f.type,
      size: f.size,
      previewUrl: URL.createObjectURL(f),
    }));

    setFiles((prev) => {
      const filtered = enhanced.filter(
        (f) => !prev.some((p) => p.name === f.name && p.size === f.size)
      );
      const merged = [...prev, ...filtered];

      if (prev.length === 0 && merged.length > 0) {
        setPreviewIndex(0);
      }

      return merged;
    });

    e.target.value = "";
    setMessage("");
  };

  const handleSave = async () => {
    if (!files.length) {
      setMessage("Primero adjunta al menos un documento.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      // Aquí iría tu llamada real al backend con FormData:
      // const fd = new FormData();
      // files.forEach((f) => fd.append("documentos", f.file));
      // await fetch("/api/responsable/clasificados", { method: "POST", body: fd });

      await new Promise((res) => setTimeout(res, 1200));

      setMessage("Documentos publicados correctamente (simulado).");
    } catch (err) {
      console.error(err);
      setMessage(" Ocurrió un error al publicar los documentos.");
    } finally {
      setSaving(false);
    }
  };

  const current = files[previewIndex] || null;
  const ext = current ? current.name.toLowerCase().split(".").pop() : "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Publicar documentos de Medallero
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Adjunta uno o varios documentos (PDF, imágenes, CSV, Excel, Word,
          etc.) con la información oficial de los Ganadores. 
        </p>

        {/* Sección de carga */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Adjuntar documentos</h2>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium cursor-pointer hover:bg-gray-900">
            <span>Seleccionar archivos</span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,image/*,.csv,.xls,.xlsx,.doc,.docx"
            />
          </label>

          <p className="text-xs text-gray-500 mt-2">
            Formatos recomendados: PDF, imágenes, CSV, Excel, Word. Puedes
            adjuntar uno o varios archivos.
          </p>

          {/* Lista + vista previa */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lista */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold mb-2">
                  Archivos cargados
                </h3>
                <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {files.map((f, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className={`w-full text-left text-xs px-2 py-1 rounded-md border transition ${
                          idx === previewIndex
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <span className="block truncate">{f.name}</span>
                        <span className="block text-[10px] text-gray-500">
                          {(f.size / 1024).toFixed(1)} KB
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vista previa */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-2">Vista previa</h3>

                {!current && (
                  <div className="w-full h-64 md:h-80 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                    No hay archivo seleccionado.
                  </div>
                )}

                {current && (
                  <div className="w-full h-64 md:h-80 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* PDF */}
                    {current.type === "application/pdf" ? (
                      <iframe
                        src={current.previewUrl}
                        className="w-full h-full"
                        title={current.name}
                      />
                    ) : // Imagen
                    current.type.startsWith("image/") ? (
                      <img
                        src={current.previewUrl}
                        alt={current.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : // CSV
                    ext === "csv" ? (
                      <CsvPreview file={current.file} />
                    ) : // Excel
                    ext === "xls" || ext === "xlsx" ? (
                      <ExcelPreview file={current.file} />
                    ) : // DOCX
                    ext === "docx" ? (
                      <DocxPreview file={current.file} />
                    ) : (
                      // Otros
                      <div className="p-4 text-center text-sm text-gray-500">
                        Vista previa no disponible para este tipo de archivo.
                        <br />
                        Archivo:{" "}
                        <span className="font-mono">{current.name}</span>
                        <br />
                        <a
                          href={current.previewUrl}
                          download={current.name}
                          className="text-blue-600 underline mt-2 inline-block"
                        >
                          Descargar archivo
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Mensajes y acciones */}
        {message && (
          <div className="mb-4 text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-700">
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || files.length === 0}
            className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Publicando..." : "Publicar documentos"}
          </button>
        </div>
      </main>
    </div>
  );
}
