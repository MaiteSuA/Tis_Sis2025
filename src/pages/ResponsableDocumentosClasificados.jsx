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
export default function ResponsableDocumentosClasificados() {
  const [files, setFiles] = useState([]); // archivos seleccionados
  const [previewIndex, setPreviewIndex] = useState(0); // cuál estoy previsualizando
  const [saving, setSaving] = useState(false); // estado de "Publicando..."
  const [message, setMessage] = useState(""); // mensaje de estado

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

  // Eliminar un archivo individual
  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToDelete);

      // Liberar la URL del objeto
      if (prevFiles[indexToDelete]?.previewUrl) {
        URL.revokeObjectURL(prevFiles[indexToDelete].previewUrl);
      }

      // Ajustar índice de vista previa
      if (previewIndex >= newFiles.length) {
        setPreviewIndex(Math.max(0, newFiles.length - 1));
      }

      return newFiles;
    });
  };

  // Eliminar todos los archivos (DESCARTAR DOCUMENTOS)
  const handleDeleteAllFiles = () => {
    // liberar URLs
    files.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });

    setFiles([]);
    setPreviewIndex(0);
    setMessage("");
  };

  // GUARDAR A LA API
  const handleSave = async () => {
  if (!files.length) {
    setMessage("Primero adjunta al menos un documento.");
    return;
  }

  const confirmar = window.confirm(
    "⚠️ ADVERTENCIA\n\n" +
    "Desea Publicar los clasificados actuales.\n\n" +
    "¿Está seguro de continuar?"
  );

  if (!confirmar) {
    setMessage("Operación cancelada por el usuario.");
    return;
  }

  setSaving(true);
  setMessage("");

  try {
    const rows = await extractExcelData();

    if (!rows.length) {
      setMessage("❌ El Excel no contiene datos válidos.");
      setSaving(false);
      return;
    }

    // 1️⃣ Validar que TODOS los estados sean "Clasificado" (exactamente)
    const filasInvalidas = rows.filter(
      (r) => String(r.estadoTexto || "").trim() !== "Clasificado"
    );

    if (filasInvalidas.length > 0) {
      setMessage(
        `❌ No se puede publicar: hay ${filasInvalidas.length} ` +
        `fila(s) con estado diferente de "Clasificado". ` +
        `Para publicar, TODOS deben estar exactamente como "Clasificado".`
      );
      setSaving(false);
      console.log("Filas con estado inválido:", filasInvalidas);
      return;
    }

    // 2️⃣ Todos están clasificados
    const participantesClasificados = rows;

    // 3️⃣ Enviar al backend
    const token = localStorage.getItem("token");
    const apiUrl = `${import.meta.env.VITE_API_URL}/clasificados/cargar`;
    
    console.log("📤 URL:", apiUrl);
    console.log("📤 Datos a enviar:", { rows: participantesClasificados });

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rows: participantesClasificados }),
    });

    console.log("📥 Respuesta HTTP:", {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok
    });

    // ✅ Primero intenta leer como texto para debug
    const responseText = await res.text();
    console.log("📥 Response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log("📥 Response JSON:", result);
    } catch (jsonError) {
      console.error("❌ Error parsing JSON:", jsonError);
      throw new Error(`La respuesta no es JSON válido: ${responseText.substring(0, 100)}...`);
    }

    // ✅ Verifica si la respuesta tiene la estructura esperada
    if (!result) {
      throw new Error("La respuesta está vacía");
    }

    // ✅ Si result.ok es false, lanza error
    if (result.ok === false) {
      throw new Error(result.message || "Error del servidor");
    }

    // ✅ Si llegamos aquí, fue exitoso
    let mensaje = `✅ Publicados ${result.count || 0} participantes clasificados.\n`;
    /*
    if (result.duplicados > 0) {
      mensaje += `⚠️ Se omitieron ${result.duplicados} duplicados dentro del Excel.\n`;
    }
    
    if (result.errores > 0) {
      mensaje += `❌ Hubo ${result.errores} errores en el procesamiento.\n`;
    }
    
    // ✅ Mostrar resumen si existe
    if (result.summary) {
      mensaje += `\n📊 Resumen:\n`;
      mensaje += `• Total en Excel: ${result.summary.totalEnviado}\n`;
      mensaje += `• Duplicados omitidos: ${result.summary.duplicadosOmitidos}\n`;
      mensaje += `• Filas únicas: ${result.summary.filasUnicas}\n`;
      mensaje += `• Publicados exitosamente: ${result.summary.exitosas}\n`;
      mensaje += `• Errores: ${result.summary.errores}`;
    } else {
      // Si no hay summary, mostrar info básica
      mensaje += `\n📊 Total procesado: ${participantesClasificados.length} participantes.`;
    }
*/
    setMessage(mensaje);
    
  } catch (err) {
    console.error("❌ Error completo al publicar:", err);
    setMessage(`❌ Error al publicar los documentos: ${err.message}`);
  } finally {
    setSaving(false);
  }
};

  const extractExcelData = async () => {
    if (!files.length) return [];

    const excelFiles = files.filter(
      (f) =>
        f.name.toLowerCase().endsWith(".xls") ||
        f.name.toLowerCase().endsWith(".xlsx")
    );
    if (!excelFiles.length) return [];

    // Tomamos solo el primer Excel
    const file = excelFiles[0].file;
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws);

    // Mapeo de estados del Excel al enum de Prisma
    const estadoMap = {
      
      Clasificado: "CLASIFICADO",
    };

    return json.map(r => ({
      id_inscrito: Number(r.ID_Inscrito),
      id_fase: Number(r.Fase),
      estado: estadoMap[r.Estado]
    }));
  };

  const current = files[previewIndex] || null;
  const ext = current ? current.name.toLowerCase().split(".").pop() : "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Publicar documentos de Clasificados
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Adjunta uno o varios documentos (PDF, imágenes, CSV, Excel, Word,
          etc.) con la información oficial de los clasificados.
        </p>

        {/* Sección de carga */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Adjuntar documentos</h2>

            {/* Botón DESCARTAR DOCUMENTOS (solo si hay archivos) */}
            {files.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAllFiles}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                 Descartar documentos
              </button>
            )}
          </div>

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
                  Archivos cargados ({files.length})
                </h3>
                <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {files.map((f, idx) => (
                    <li key={idx} className="group relative">
                      <button
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className={`w-full text-left text-xs px-2 py-1 rounded-md border transition ${
                          idx === previewIndex
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200 group-hover:pr-8"
                        }`}
                      >
                        <span className="block truncate">{f.name}</span>
                        <span className="block text-[10px] text-gray-500">
                          {(f.size / 1024).toFixed(1)} KB
                        </span>
                      </button>

                      {/* Botón eliminar individual */}
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(idx)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700"
                        aria-label={`Eliminar ${f.name}`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vista previa */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Vista previa</h3>
                  {current && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(previewIndex)}
                      className="px-2 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                    >
                       Eliminar este archivo
                    </button>
                  )}
                </div>

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
          <div
            className={`mb-4 text-sm px-3 py-2 rounded-md border ${
              message.includes("✅")
                ? "bg-green-50 border-green-200 text-green-700"
                : message.includes("❌")
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-gray-100 border-gray-300 text-gray-700"
            }`}
          >
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