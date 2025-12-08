// src/pages/Medallero.jsx
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
} from "docx";
import html2canvas from "html2canvas";

const API_MEDALLERO =
  import.meta.env.VITE_API_URL_PUBLICO ??
  "http://localhost:3000/api/publico/medallero";
// Página de medallero oficial
export default function Medallero() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const tableRef = useRef(null);
  const navigate = useNavigate();
// Cargar datos del medallero al montar el componente
  useEffect(() => {
    cargarMedallero();
  }, []);
// Cargar datos del medallero desde el backend
  async function cargarMedallero() {
    try {
      setLoading(true);
      setError("");

      const resp = await fetch(API_MEDALLERO);
      if (!resp.ok) throw new Error("No se pudo obtener el medallero");

      const data = await resp.json();
      const arr = Array.isArray(data) ? data : [];

      setRegistros(arr);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos del medallero.");
    } finally {
      setLoading(false);
    }
  }

 // Funciones para obtener datos de cada registro

  function getNombres(r) {
    return r.nombres_inscrito ?? "";
  }

  function getApellidos(r) {
    return r.apellidos_inscrito ?? "";
  }

  function getNombreCompleto(r) {
    const n = getNombres(r);
    const a = getApellidos(r);
    const full = `${n} ${a}`.trim();
    return full || "-";
  }

  function getUnidadEducativa(r) {
    return r.unidad_educativa || r.colegio || "-";
  }

  function getDepartamento(r) {
    return r.departamento || "-";
  }

  function getTipoMedalla(r) {
    return r.tipo_medalla || "-";
  }

  function getPuntajeFinal(r) {
    return r.puntaje_final != null ? Number(r.puntaje_final).toFixed(2) : "-";
  }

  // Filas para exportar
  function getExportRows() {
    return registros.map((r, index) => ({
      N: index + 1,
      Nombres: getNombres(r),
      Apellidos: getApellidos(r),
      Unidad_Educativa: getUnidadEducativa(r),
      Departamento: getDepartamento(r),
      Tipo_Medalla: getTipoMedalla(r),
      Puntaje_Final: getPuntajeFinal(r),
    }));
  }

  //descarga PDF del medallero
  function downloadPdf() {
    const rows = getExportRows();
    if (!rows.length) return;

    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      let y = 15;
      doc.setFontSize(14);
      doc.text("MEDALLERO OFICIAL", 10, y);
      y += 10;

      doc.setFont("courier", "normal");
      doc.setFontSize(9);

      // Encabezado
      const header = " # | Nombres               | Apellidos             | Institución           | Depto     | Medalla   | Puntaje";
      doc.text(header, 10, y);
      y += 4;

      doc.text("----------------------------------------------------------------------------------------------------------", 10, y);
      y += 5;

      rows.forEach((r) => {
        const line =
          `${String(r.N).padEnd(2)}| ` +
          `${String(r.Nombres).padEnd(20).slice(0, 20)} | ` +
          `${String(r.Apellidos).padEnd(20).slice(0, 20)} | ` +
          `${String(r.Unidad_Educativa).padEnd(20).slice(0, 20)} | ` +
          `${String(r.Departamento).padEnd(10)} | ` +
          `${String(r.Tipo_Medalla).padEnd(10)} | ` +
          `${r.Puntaje_Final}`;

        if (y > 280) {
          doc.addPage();
          y = 15;
        }

        doc.text(line, 10, y);
        y += 5;
      });

      doc.save("medallero_oficial.pdf");
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar PDF");
    }
  }

 // descarga Word del medallero
  async function downloadWord() {
    const rows = getExportRows();
    if (!rows.length) return;

    const headers = ["#", "Nombres", "Apellidos", "Institución", "Departamento", "Medalla", "Puntaje"];

    const headerRow = new TableRow({
      children: headers.map((h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true })],
            }),
          ],
        })
      ),
    });

    const dataRows = rows.map((r) =>
      new TableRow({
        children: [r.N, r.Nombres, r.Apellidos, r.Unidad_Educativa, r.Departamento, r.Tipo_Medalla, r.Puntaje_Final].map(
          (val) =>
            new TableCell({
              children: [new Paragraph(String(val ?? ""))],
            })
        ),
      })
    );

    const docxDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "MEDALLERO OFICIAL",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Table({ rows: [headerRow, ...dataRows] }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(docxDoc);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "medallero_oficial.docx";
    a.click();

    URL.revokeObjectURL(url);
  }

  
  async function downloadImage() {
    if (!tableRef.current) return alert("Tabla no encontrada");

    try {
      const clone = tableRef.current.cloneNode(true);

      clone.style.background = "#fff";
      clone.querySelectorAll("*").forEach((el) => {
        el.style.background = "#fff";
      });

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise((res) => setTimeout(res, 30));

      const canvas = await html2canvas(clone, { scale: 2 });

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "medallero_oficial.png";
      a.click();

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error("Error generando imagen:", err);
      alert("Error al generar imagen");
    }
  }

  // Manejar descarga según formato seleccionado
  async function handleDownload() {
    switch (downloadFormat) {
      case "pdf":
        return downloadPdf();
      case "docx":
        return downloadWord();
      case "png":
        return downloadImage();
      default:
        return downloadPdf();
    }
  }

 // Renderizado principal

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Encabezado: título + Actualizar + descargas */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          {/* Título + botón Actualizar */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold">🏆 Medallero Oficial</h1>
              <p className="text-gray-600 text-sm">
                Resultados oficiales del medallero por participante.
              </p>
            </div>

            <button
              type="button"
              onClick={cargarMedallero}
              disabled={loading}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          {/* Selector de formato + botón Descargar */}
          <div className="flex items-center gap-2">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
             {/*} <option value="png">Imagen (PNG)</option>*/}
            </select>

            <button
              onClick={handleDownload}
              disabled={!registros.length}
              className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descargar
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-sm text-gray-600">Cargando medallero...</div>
        )}

        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !registros.length && !error && (
          <div className="text-sm text-gray-500">
            Todavía no se ha publicado el medallero.
          </div>
        )}

        {!loading && registros.length > 0 && (
          <>
            {/* Estadísticas rápidas */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="text-yellow-800 font-bold text-xl">
                  {registros.filter(r => r.tipo_medalla === "ORO").length}
                </div>
                <div className="text-yellow-600 text-xs">Medallas de Oro</div>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded p-3">
                <div className="text-gray-700 font-bold text-xl">
                  {registros.filter(r => r.tipo_medalla === "PLATA").length}
                </div>
                <div className="text-gray-600 text-xs">Medallas de Plata</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <div className="text-amber-800 font-bold text-xl">
                  {registros.filter(r => r.tipo_medalla === "BRONCE").length}
                </div>
                <div className="text-amber-600 text-xs">Medallas de Bronce</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-blue-800 font-bold text-xl">
                  {registros.length}
                </div>
                <div className="text-blue-600 text-xs">Total participantes</div>
              </div>
            </div>

            {/* Tabla principal */}
            <div className="bg-white rounded shadow overflow-auto" ref={tableRef}>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-2 py-2 text-center">
                      <input type="checkbox" disabled />
                    </th>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Nombres</th>
                    <th className="px-3 py-2 text-left">Apellidos</th>
                    <th className="px-3 py-2 text-left">Institución</th>
                    <th className="px-3 py-2 text-left">Departamento</th>
                    <th className="px-3 py-2 text-left">Medalla</th>
                    <th className="px-3 py-2 text-left">Puntaje</th>
                  </tr>
                </thead>

                <tbody>
                  {registros.map((r, index) => (
                    <tr
                      key={r.id_medalla_clasificado ?? `${r.id_clasificado}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 py-2 text-center">
                        <input type="checkbox" disabled />
                      </td>
                      <td className="px-3 py-2 font-medium">{index + 1}</td>
                      <td className="px-3 py-2">{getNombres(r)}</td>
                      <td className="px-3 py-2">{getApellidos(r)}</td>
                      <td className="px-3 py-2">{getUnidadEducativa(r)}</td>
                      <td className="px-3 py-2">{getDepartamento(r)}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          r.tipo_medalla === "ORO" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : r.tipo_medalla === "PLATA" 
                              ? "bg-gray-100 text-gray-800" 
                              : "bg-amber-100 text-amber-800"
                        }`}>
                          {r.tipo_medalla === "ORO" && "🥇 "}
                          {r.tipo_medalla === "PLATA" && "🥈 "}
                          {r.tipo_medalla === "BRONCE" && "🥉 "}
                          {r.tipo_medalla}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold">
                        {getPuntajeFinal(r)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón Volver */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
              >
                Volver
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}