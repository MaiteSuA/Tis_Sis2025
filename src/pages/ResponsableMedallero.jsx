// src/pages/ResponsableMedallero.jsx
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Componentes de vista previa para diferentes tipos de archivo
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
// Vista previa para archivos Excel
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
// Renderizar el HTML generado
  return (
    <div
      className="w-full h-full overflow-auto bg-white p-3 text-xs md:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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

// Componente principal
export default function ResponsableMedallero() {
  const [files, setFiles] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== indexToDelete);
      if (prevFiles[indexToDelete]?.previewUrl) {
        URL.revokeObjectURL(prevFiles[indexToDelete].previewUrl);
      }
      if (previewIndex >= newFiles.length) {
        setPreviewIndex(Math.max(0, newFiles.length - 1));
      }
      return newFiles;
    });
  };

  const handleDeleteAllFiles = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
    setPreviewIndex(0);
    setMessage("");
  };

  //  LEE EL EXCEL DEL MEDALLERO
  const extractExcelData = async () => {
    if (!files.length) return [];

    // Buscar archivos Excel
    const excelFiles = files.filter(
      (f) =>
        f.name.toLowerCase().endsWith(".xls") ||
        f.name.toLowerCase().endsWith(".xlsx")
    );

    if (!excelFiles.length) return [];

    // Tomar solo el primer Excel
    const file = excelFiles[0].file;
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws);

    // Transformar los datos para que coincidan con lo que espera el backend
    return json.map((row) => {
      // Buscar columnas con diferentes nombres posibles
      const idClasificado = 
        row.ID_Clasificado ?? 
        row["ID Clasificado"] ?? 
        row.id_clasificado ?? 
        row["Id Clasificado"] ??
        row.Clasificado_ID ??
        row["Clasificado ID"];
      
      const tipoMedalla = 
        row.Tipo_Medalla ?? 
        row["Tipo Medalla"] ?? 
        row.tipo_medalla ?? 
        row.Medalla ??
        row["Tipo de Medalla"] ??
        row.Tipo;
      
      const puntajeFinal = 
        row.Puntaje_Final ?? 
        row["Puntaje Final"] ?? 
        row.puntaje_final ?? 
        row.Puntaje ??
        row.Score ??
        row.Resultado;
      
      const esEmpate = 
        row.Es_Empate ?? 
        row["Es Empate"] ?? 
        row.es_empate ?? 
        row.Empate ??
        row.Tie;
      
      const idParametro = 
        row.ID_Parametro ?? 
        row["ID Parametro"] ?? 
        row.id_parametro ?? 
        row.Parametro ??
        row["ID_Parametro"] ??
        1; // Por defecto 1

      return {
        id_clasificado: idClasificado ? Number(idClasificado) : null,
        tipo_medalla: String(tipoMedalla || "").trim(),
        puntaje_final: puntajeFinal ? Number(puntajeFinal) : null,
        es_empate: esEmpate === true || 
                  esEmpate === "true" || 
                  esEmpate === "Sí" || 
                  esEmpate === "Si" || 
                  esEmpate === "1" ||
                  esEmpate === "Yes",
        id_parametro: idParametro ? Number(idParametro) : 1,
      };
    });
  };

  // GUARDAR A LA API
  const handleSave = async () => {
    if (!files.length) {
      setMessage("Primero adjunta al menos un documento.");
      return;
    }


    const confirmar = window.confirm(
    " ADVERTENCIA\n\n" +
    "Publicar Medallero.\n\n" +
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
        setMessage(" El Excel no contiene datos válidos.");
        setSaving(false);
        return;
      }

      //  VALIDACIONES IMPORTANTES
      const filasSinId = rows.filter(r => !r.id_clasificado);
      if (filasSinId.length > 0) {
        setMessage(` Hay ${filasSinId.length} filas sin ID_Clasificado.`);
        setSaving(false);
        return;
      }

      const filasSinTipoMedalla = rows.filter(r => !r.tipo_medalla);
      if (filasSinTipoMedalla.length > 0) {
        setMessage(` Hay ${filasSinTipoMedalla.length} filas sin Tipo_Medalla.`);
        setSaving(false);
        return;
      }

      const filasSinPuntaje = rows.filter(r => r.puntaje_final === null || r.puntaje_final === undefined);
      if (filasSinPuntaje.length > 0) {
        setMessage(` Hay ${filasSinPuntaje.length} filas sin Puntaje_Final.`);
        setSaving(false);
        return;
      }

      // Validar tipos de medalla
      const tiposValidos = ["ORO", "PLATA", "BRONCE", "Oro", "Plata", "Bronce", "oro", "plata", "bronce"];
      const filasMedallaInvalida = rows.filter(r => 
        !tiposValidos.includes(r.tipo_medalla.trim())
      );

      if (filasMedallaInvalida.length > 0) {
        setMessage(` Hay ${filasMedallaInvalida.length} filas con tipo de medalla inválido. Solo: Oro, Plata, Bronce.`);
        setSaving(false);
        return;
      }

      // Normalizar tipos de medalla a MAYÚSCULAS
      const rowsNormalizados = rows.map(r => ({
        ...r,
        tipo_medalla: r.tipo_medalla.trim().toUpperCase()
      }));

      console.log(" Enviando al backend:", rowsNormalizados);

      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/medallero/cargar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rows: rowsNormalizados }),
        }
      );

      // Leer la respuesta
      const responseText = await res.text();
      console.log(" Respuesta backend:", responseText);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${responseText}`);
      }

      // Intentar parsear como JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Respuesta no es JSON válido: ${responseText}`);
      }

      if (!result.ok) {
        throw new Error(result.message || "Backend devolvió ok=false");
      }

      setMessage(" Medallero publicado correctamente.");
      
      // Opcional: Limpiar archivos después de éxito
      setTimeout(() => {
        handleDeleteAllFiles();
      }, 1500);

    } catch (err) {
      console.error("ERROR PUBLICANDO MEDALLERO:", err);
      setMessage(` Error al publicar el medallero: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


// Vista previa del archivo seleccionado

  const current = files[previewIndex] || null;
  const ext = current ? current.name.toLowerCase().split(".").pop() : "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Publicar documentos de Medallero
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Adjunta el Medallero oficial.  
          <br />
          {/*<strong>ID_Clasificado</strong> (número), 
          <strong>Tipo_Medalla</strong> (Oro/Plata/Bronce), 
          <strong>Puntaje_Final</strong> (número), 
          <strong>Es_Empate</strong> (opcional, Sí/No),
          <strong>ID_Parametro</strong> (opcional, número)*/}
        </p>

        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Adjuntar documentos</h2>

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
            Formato principal: Excel con el medallero. También puedes adjuntar
            PDFs, imágenes, CSV o Word como respaldo.
          </p>

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(idx)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

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
                    {current.type === "application/pdf" ? (
                      <iframe
                        src={current.previewUrl}
                        className="w-full h-full"
                        title={current.name}
                      />
                    ) : current.type.startsWith("image/") ? (
                      <img
                        src={current.previewUrl}
                        alt={current.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : ext === "csv" ? (
                      <CsvPreview file={current.file} />
                    ) : ext === "xls" || ext === "xlsx" ? (
                      <ExcelPreview file={current.file} />
                    ) : ext === "docx" ? (
                      <DocxPreview file={current.file} />
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Vista previa no disponible.
                        <br />
                        Archivo:{" "}
                        <span className="font-mono">{current.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {message && (
          <div
            className={`mb-4 text-sm px-3 py-2 rounded-md border ${
              message.includes("")
                ? "bg-green-50 border-green-200 text-green-700"
                : message.includes("")
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
            {saving ? "Publicando..." : "Publicar medallero"}
          </button>
        </div>
      </main>
    </div>
  );
}