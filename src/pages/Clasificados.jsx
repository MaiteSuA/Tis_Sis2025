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

  // Cargar clasificados cuando el componente se monta
  useEffect(() => {
    cargarClasificados();
  }, []);

  // Función para cargar clasificados del backend
  async function cargarClasificados() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      const res = await fetch(`${API_URL}/clasificados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      
      // Diferentes formatos de respuesta posibles
      let lista = [];
      
      if (json.data && Array.isArray(json.data)) {
        lista = json.data;
      } else if (Array.isArray(json)) {
        lista = json;
      } else if (json.ok && json.data && Array.isArray(json.data)) {
        lista = json.data;
      } else if (json.clasificados && Array.isArray(json.clasificados)) {
        lista = json.clasificados;
      }
      
      console.log("Clasificados cargados:", lista.length);
      setClasificados(lista);
      
    } catch (err) {
      console.error("Error cargando clasificados:", err);
      setError("No se pudieron cargar los clasificados. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     HELPERS DE DATOS
  =============================== */

  function getNombres(c) {
    // Si vienen datos anidados o planos
    if (c.inscritos && c.inscritos.nombres) return c.inscritos.nombres;
    if (c.nombres) return c.nombres;
    if (c.nombre) return c.nombre;
    if (c.nombres_inscrito) return c.nombres_inscrito;
    return "";
  }

  function getApellidos(c) {
    if (c.inscritos && c.inscritos.apellidos) return c.inscritos.apellidos;
    if (c.apellidos) return c.apellidos;
    if (c.apellidos_inscrito) return c.apellidos_inscrito;
    return "";
  }

  function getNombreCompleto(c) {
    const n = getNombres(c);
    const a = getApellidos(c);
    const full = `${n} ${a}`.trim();
    return full || "-";
  }

  function getCi(c) {
    if (c.inscritos && c.inscritos.ci) return c.inscritos.ci;
    if (c.ci) return c.ci;
    if (c.ci_inscrito) return c.ci_inscrito;
    return "";
  }

  function getColegio(c) {
    if (c.inscritos && c.inscritos.colegio) return c.inscritos.colegio;
    return c.colegio || "";
  }

  function getContactoTutor(c) {
    if (c.inscritos && c.inscritos.contacto_tutor) return c.inscritos.contacto_tutor;
    return c.contacto_tutor || "";
  }

  function getUnidadEducativa(c) {
    if (c.inscritos && c.inscritos.unidad_educativa) return c.inscritos.unidad_educativa;
    return c.unidad_educativa || "";
  }

  function getDepartamento(c) {
    if (c.inscritos && c.inscritos.departamento) return c.inscritos.departamento;
    return c.departamento || "";
  }

  function getGradoEscolaridad(c) {
    if (c.inscritos && c.inscritos.grado_escolaridad) return c.inscritos.grado_escolaridad;
    return c.grado_escolaridad || "";
  }

  function getArea(c) {
    if (c.inscritos && c.inscritos.area) return c.inscritos.area;
    if (c.inscritos && c.inscritos.id_area) return c.inscritos.id_area;
    return c.id_area || c.area || "";
  }

  function getTutorAcademico(c) {
    if (c.inscritos && c.inscritos.tutor_academico) return c.inscritos.tutor_academico;
    return c.tutor_academico || "";
  }

  // Convierte estado → nombre de fase visible
  function getNombreFase(c) {
    if (c.estado === "CLASIFICADO") return "FINAL";
    if (c.estado === "NO_CLASIFICADO") return "NO FINALISTA";
    return "SIN FASE";
  }

  // Filas para exportar
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
     DESCARGA EXCEL (formato mejorado)
  =============================== */
  function downloadExcel() {
    const rows = getExportRows();
    if (!rows.length) {
      alert("No hay datos para exportar");
      return;
    }

    const excelData = [
      ["CLASIFICADOS PUBLICADOS"],
      [""],
      ["#", "Nombres", "Apellidos", "CI", "Fase", "Estado"]
    ];

    rows.forEach(r => {
      excelData.push([
        r.N,
        r.Nombres,
        r.Apellidos,
        r.CI,
        r.Fase,
        r.Estado
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    ws["A1"].s = { font: { bold: true, sz: 14 } };
    ws["A3"].s = { font: { bold: true } };
    ws["B3"].s = { font: { bold: true } };
    ws["C3"].s = { font: { bold: true } };
    ws["D3"].s = { font: { bold: true } };
    ws["E3"].s = { font: { bold: true } };
    ws["F3"].s = { font: { bold: true } };
    
    ws['!cols'] = [
      { wch: 4 },
      { wch: 25 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 }
    ];
    
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    
    XLSX.utils.book_append_sheet(wb, ws, "Clasificados");
    XLSX.writeFile(wb, "clasificados_publicados.xlsx");
  }

  /* ===============================
     DESCARGA CSV
  =============================== */
  function downloadCsv() {
    const rows = getExportRows();
    if (!rows.length) {
      alert("No hay datos para exportar");
      return;
    }

    const header = "#,Nombres,Apellidos,CI,Fase,Estado";
    const csvLines = rows.map(r => 
      `${r.N},${r.Nombres},${r.Apellidos},${r.CI},${r.Fase},${r.Estado}`
    );

    const content = [header, ...csvLines].join("\n");
    
    const blob = new Blob(["\uFEFF" + content], {
      type: "text/csv;charset=utf-8;"
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
  function downloadPdf() {
    const rows = getExportRows();
    if (!rows.length) {
      alert("No hay datos para exportar");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      let y = 15;
      doc.setFontSize(14);
      doc.text("Clasificados publicados", 10, y);
      y += 10;

      doc.setFont("courier", "normal");
      doc.setFontSize(9);

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
    if (!rows.length) {
      alert("No hay datos para exportar");
      return;
    }

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

    try {
      const blob = await Packer.toBlob(docxDoc);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "clasificados_publicados.docx";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generando Word:", err);
      alert("Error al generar documento Word");
    }
  }

  /* ===============================
     DESCARGA IMAGEN PNG - VERSIÓN MEJORADA
  =============================== */
  async function downloadImage() {
    if (!tableRef.current || !clasificados.length) {
      alert("No hay datos para exportar");
      return;
    }

    try {
      // Crear una copia completa de la tabla para la imagen
      const originalTable = tableRef.current;
      const clone = originalTable.cloneNode(true);
      
      // Asegurar que todos los estilos sean visibles
      clone.style.width = "100%";
      clone.style.maxWidth = "100%";
      clone.style.tableLayout = "fixed";
      clone.style.borderCollapse = "collapse";
      clone.style.background = "#ffffff";
      
      // Aplicar estilos a todos los elementos
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.backgroundColor = "";
        el.style.color = "";
        el.style.fontFamily = "Arial, sans-serif";
        el.style.boxSizing = "border-box";
      });
      
      // Estilos específicos para tabla
      const ths = clone.querySelectorAll('th');
      ths.forEach(th => {
        th.style.backgroundColor = "#1f2937"; // bg-gray-800
        th.style.color = "#ffffff";
        th.style.fontWeight = "600";
        th.style.padding = "8px 12px";
        th.style.border = "1px solid #374151";
        th.style.textAlign = "left";
      });
      
      const tds = clone.querySelectorAll('td');
      tds.forEach((td, index) => {
        const rowIndex = Math.floor(index / 6); // 6 columnas por fila
        td.style.backgroundColor = rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb"; // bg-gray-50
        td.style.color = "#111827";
        td.style.padding = "8px 12px";
        td.style.border = "1px solid #e5e7eb";
        td.style.textAlign = "left";
        td.style.verticalAlign = "middle";
      });
      
      // Crear contenedor para la captura
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
      wrapper.style.backgroundColor = "#ffffff";
      wrapper.style.padding = "20px";
      wrapper.style.boxSizing = "border-box";
      wrapper.style.zIndex = "9999";
      wrapper.style.overflow = "auto";
      
      // Agregar título
      const title = document.createElement("h1");
      title.textContent = "Clasificados Publicados";
      title.style.fontSize = "24px";
      title.style.fontWeight = "bold";
      title.style.marginBottom = "20px";
      title.style.color = "#111827";
      title.style.textAlign = "center";
      
      wrapper.appendChild(title);
      wrapper.appendChild(clone);
      
      // Agregar al DOM temporalmente
      document.body.appendChild(wrapper);
      
      // Esperar a que se renderice
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Capturar con html2canvas
        const canvas = await html2canvas(wrapper, {
          scale: 2, // Mayor calidad
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        
        // Crear imagen y descargar
        const url = canvas.toDataURL("image/png", 1.0);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clasificados_publicados.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
      } catch (canvasError) {
        console.error("Error en html2canvas:", canvasError);
        alert("Error al generar la imagen. Intenta con otro formato.");
      } finally {
        // Limpiar
        document.body.removeChild(wrapper);
      }
      
    } catch (err) {
      console.error("Error generando imagen:", err);
      alert("Error al generar imagen. Intenta con otro formato.");
    }
  }

  /* ===============================
     CONTROLADOR DE DESCARGAS
  =============================== */
  async function handleDownload() {
    if (!clasificados.length) {
      alert("No hay clasificados para descargar");
      return;
    }

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
      default:
        alert("Formato no soportado");
    }
  }

  /* ===============================
     VISTA - MANTENER LA MISMA TABLA SIMPLIFICADA
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
              {/*<option value="png">Imagen (PNG)</option>*/}
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
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No hay clasificados registrados todavía.</p>
            <p className="text-sm">
              Publica documentos en la sección "Publicar documentos de Clasificados" primero.
            </p>
          </div>
        )}

        {!loading && clasificados.length > 0 && (
          <>
            <div className="mb-2 text-sm text-gray-600">
              Mostrando {clasificados.length} clasificados
            </div>
            
            <div
              className="bg-white rounded shadow overflow-auto"
              ref={tableRef}
            >
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left border border-gray-700">#</th>
                    <th className="px-3 py-2 text-left border border-gray-700">Nombres</th>
                    <th className="px-3 py-2 text-left border border-gray-700">Apellidos</th>
                    <th className="px-3 py-2 text-left border border-gray-700">CI</th>
                    <th className="px-3 py-2 text-left border border-gray-700">Fase</th>
                    <th className="px-3 py-2 text-left border border-gray-700">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {clasificados.map((c, index) => (
                    <tr
                      key={c.id || `${c.id_inscrito}-${c.id_fase}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-3 py-2 border border-gray-200">{index + 1}</td>
                      <td className="px-3 py-2 border border-gray-200">{getNombres(c)}</td>
                      <td className="px-3 py-2 border border-gray-200">{getApellidos(c)}</td>
                      <td className="px-3 py-2 border border-gray-200">{getCi(c)}</td>
                      <td className="px-3 py-2 border border-gray-200">{getNombreFase(c)}</td>
                      <td className="px-3 py-2 border border-gray-200">
                        <span className={`px-2 py-1 rounded text-xs ${
                          c.estado === "CLASIFICADO" 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}>
                          {c.estado}
                        </span>
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