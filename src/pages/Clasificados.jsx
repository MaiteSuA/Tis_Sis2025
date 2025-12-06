// src/pages/ResponsableClasificados.jsx
import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
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

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export default function ResponsableClasificados() {
  const [clasificados, setClasificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("xlsx");
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarClasificados();
  }, []);

  async function cargarClasificados() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/clasificados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      const lista = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      setClasificados(lista);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los clasificados.");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     HELPERS DE DATOS
  =============================== */

  function getNombres(c) {
    return (
      c.nombres_inscrito ??
      c.inscritos?.nombres ??
      c.inscritos?.nombre ??
      ""
    );
  }

  function getApellidos(c) {
    return (
      c.apellidos_inscrito ??
      c.inscritos?.apellidos ??
      c.inscritos?.apellido ??
      ""
    );
  }

  function getNombreCompleto(c) {
    const n = getNombres(c);
    const a = getApellidos(c);
    const full = `${n} ${a}`.trim();
    return full || "-";
  }

  function getCi(c) {
    // primero el campo plano que viene del SELECT, luego por si algún día viene anidado
    return c.ci_inscrito ?? c.inscritos?.ci_inscrito ?? "";
  }

  function getColegio(c) {
    return c.colegio ?? c.inscritos?.colegio ?? "";
  }

  function getContactoTutor(c) {
    return c.contacto_tutor ?? c.inscritos?.contacto_tutor ?? "";
  }

  function getUnidadEducativa(c) {
    return c.unidad_educativa ?? c.inscritos?.unidad_educativa ?? "";
  }

  function getDepartamento(c) {
    return c.departamento ?? c.inscritos?.departamento ?? "";
  }

  function getGradoEscolaridad(c) {
    return c.grado_escolaridad ?? c.inscritos?.grado_escolaridad ?? "";
  }

  function getArea(c) {
    // de momento mostramos el id_area; si luego haces JOIN con AREA, aquí pondrías el nombre
    return c.id_area ?? c.inscritos?.id_area ?? "";
  }

  function getTutorAcademico(c) {
    return c.tutor_academico ?? c.inscritos?.tutor_academico ?? "";
  }

  // Convierte estado → nombre de fase visible
  function getNombreFase(c) {
    if (c.estado === "CLASIFICADO") return "FINAL";
    if (c.estado === "NO_CLASIFICADO") return "NO FINALISTA";
    return "SIN FASE";
  }

  // Filas para exportar
    // Filas para exportar (TODAS las columnas visibles)
  function getExportRows() {
    return clasificados.map((c, index) => ({
      N: index + 1,
      Nombres: getNombres(c),
      Apellidos: getApellidos(c),
      CI: getCi(c),
      Colegio: getColegio(c),
      Contacto_Tutor: getContactoTutor(c),
      Unidad_Educativa: getUnidadEducativa(c),
      Departamento: getDepartamento(c),
      Grado_Escolaridad: getGradoEscolaridad(c),
      Area: getArea(c),
      Tutor_Academico: getTutorAcademico(c),
      Fase: getNombreFase(c),
      Estado: c.estado,
    }));
  }

  /* ===============================
       DESCARGA EXCEL
  =============================== */
  function downloadExcel() {
    const rows = getExportRows();
    if (!rows.length) return;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Clasificados");
    XLSX.writeFile(wb, "clasificados_publicados.xlsx");
  }

  /* ===============================
       DESCARGA CSV
  =============================== */
  function downloadCsv() {
    const rows = getExportRows();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(";"),
      ...rows.map((r) => headers.map((h) => (r[h] ?? "")).join(";")),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clasificados_publicados.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ===============================
       DESCARGA PDF
  =============================== */
  /*function downloadPdf() {
    const rows = getExportRows();
    if (!rows.length) return;

    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      let y = 15;
      doc.setFontSize(14);
      doc.text("Clasificados publicados", 10, y);
      y += 8;

      doc.setFontSize(8);

      const headers = Object.keys(rows[0]);

      // cabecera
      doc.text(headers.join(" | "), 10, y);
      y += 4;
      doc.text("".padEnd(180, "-"), 10, y);
      y += 4;

      rows.forEach((r) => {
        const line = headers.map((h) => String(r[h] ?? "")).join(" | ");
        // salto de página si se acaba el espacio
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(line.substring(0, 180), 10, y);
        y += 4;
      });

      doc.save("clasificados_publicados.pdf");
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar PDF");
    }
  }
*/
  /* ===============================
       DESCARGA WORD
  =============================== */
  /*
  async function downloadWord() {
    const rows = getExportRows();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);

    const headerRow = new TableRow({
      children: headers.map(
        (h) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: h, bold: true })],
              }),
            ],
          })
      ),
    });

    const dataRows = rows.map(
      (r) =>
        new TableRow({
          children: headers.map(
            (h) =>
              new TableCell({
                children: [new Paragraph(String(r[h] ?? ""))],
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
                  text: "Clasificados publicados",
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
    a.download = "clasificados_publicados.docx";
    a.click();

    URL.revokeObjectURL(url);
  }
*/
/* ===============================
     DESCARGA PDF
=============================== */
function downloadPdf() {
  const rows = getExportRows();
  if (!rows.length) return;

  try {
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    let y = 15;
    doc.setFontSize(14);
    doc.text("Clasificados publicados", 10, y);
    y += 10;

    doc.setFont("courier", "normal");
    doc.setFontSize(9);

    // Usamos solo algunas columnas visibles para mantener formato limpio
    const header =
      " # | Nombres               | Apellidos             | CI        | Fase      | Estado";
    doc.text(header, 10, y);
    y += 4;

    doc.text("--------------------------------------------------------------------------", 10, y);
    y += 5;

    rows.forEach((r) => {
      const line =
        `${String(r.N).padEnd(2)}| ` +
        `${String(r.Nombres).padEnd(20).slice(0, 20)} | ` +
        `${String(r.Apellidos).padEnd(20).slice(0, 20)} | ` +
        `${String(r.CI).padEnd(10)} | ` +
        `${String(r.Fase).padEnd(10)} | ` +
        `${r.Estado}`;

      if (y > 280) {
        doc.addPage();
        y = 15;
      }

      doc.text(line, 10, y);
      y += 5;
    });

    doc.save("clasificados_publicados.pdf");
  } catch (err) {
    console.error("Error generando PDF:", err);
    alert("Error al generar PDF");
  }
}


/* ===============================
     DESCARGA WORD
=============================== */
async function downloadWord() {
  const rows = getExportRows();
  if (!rows.length) return;

  const headers = ["#", "Nombres", "Apellidos", "CI", "Fase", "Estado"];

  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true })],
            }),
          ],
        })
    ),
  });

  const dataRows = rows.map(
    (r) =>
      new TableRow({
        children: [
          r.N,
          r.Nombres,
          r.Apellidos,
          r.CI,
          r.Fase,
          r.Estado,
        ].map((val) =>
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
                text: "Clasificados publicados",
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
  a.download = "clasificados_publicados.docx";
  a.click();

  URL.revokeObjectURL(url);
}


  /* ===============================
       DESCARGA IMAGEN PNG
  =============================== */
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
      a.download = "clasificados_publicados.png";
      a.click();

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error("Error generando imagen:", err);
      alert("Error al generar imagen");
    }
  }

  /* ===============================
       CONTROLADOR DE DESCARGAS
  =============================== */
  async function handleDownload() {
    switch (downloadFormat) {
      case "xlsx":
        return downloadExcel();
      case "csv":
        return downloadCsv();
      case "pdf":
        return downloadPdf();
      case "docx":
        return downloadWord();
      case "png":
        return downloadImage();
    }
  }

  /* ===============================
       VISTA
  =============================== */

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Encabezado: título + Actualizar + descargas */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        {/* Título + botón Actualizar */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Clasificados - Oficial</h1>
            <p className="text-gray-600 text-sm">
              Vista de los inscritos clasificados.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarClasificados}
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
            <option value="xlsx">Excel</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="png">Imagen (PNG)</option>
          </select>

          <button
            onClick={handleDownload}
            disabled={!clasificados.length}
            className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descargar
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-600">Cargando clasificados...</div>
      )}

      {error && (
        <div className="mb-4 text-sm px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {!loading && !clasificados.length && !error && (
        <div className="text-sm text-gray-500">
          No hay clasificados registrados todavía.
        </div>
      )}

      {!loading && clasificados.length > 0 && (
        <>
          <div
            className="bg-white rounded shadow overflow-auto"
            ref={tableRef}
          >
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-2 py-2 text-center">
                    <input type="checkbox" disabled />
                  </th>
                  <th className="px-3 py-2 text-left">Nombres</th>
                  <th className="px-3 py-2 text-left">Apellidos</th>
                  <th className="px-3 py-2 text-left">CI</th>
                  <th className="px-3 py-2 text-left">Colegio</th>
                  <th className="px-3 py-2 text-left">Contacto_Tutor</th>
                  <th className="px-3 py-2 text-left">Unidad_Educativa</th>
                  <th className="px-3 py-2 text-left">Departamento</th>
                  <th className="px-3 py-2 text-left">Grado_Escolaridad</th>
                  <th className="px-3 py-2 text-left">Área</th>
                  <th className="px-3 py-2 text-left">Tutor_Académico</th>
                  <th className="px-3 py-2 text-left">Fase</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                </tr>
              </thead>

              <tbody>
                {clasificados.map((c, index) => (
                  <tr
                    key={c.id_clasificado ?? `${c.id_inscrito}-${c.id_fase}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-2 py-2 text-center">
                      <input type="checkbox" disabled />
                    </td>
                    <td className="px-3 py-2">{getNombres(c)}</td>
                    <td className="px-3 py-2">{getApellidos(c)}</td>
                    <td className="px-3 py-2">{getCi(c)}</td>
                    <td className="px-3 py-2">{getColegio(c)}</td>
                    <td className="px-3 py-2">{getContactoTutor(c)}</td>
                    <td className="px-3 py-2">{getUnidadEducativa(c)}</td>
                    <td className="px-3 py-2">{getDepartamento(c)}</td>
                    <td className="px-3 py-2">{getGradoEscolaridad(c)}</td>
                    <td className="px-3 py-2">{getArea(c)}</td>
                    <td className="px-3 py-2">{getTutorAcademico(c)}</td>
                    <td className="px-3 py-2">{getNombreFase(c)}</td>
                    <td className="px-3 py-2">{c.estado}</td>
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
