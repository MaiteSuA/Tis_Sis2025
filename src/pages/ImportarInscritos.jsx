import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import StatsStrip from "../components/StatsStrip";
import ImportCsvCard from "../components/ImportCsvCard";
import DataTable from "../components/DataTable";
import { importInscritosCsv, getDashboardStats } from "../services/api";
import Papa from "papaparse";

export default function App() {
  const [previewRows, setPreviewRows] = useState([]);
  const [totals, setTotals] = useState({
    total: 0,
    clasificados: 0,
    reportes: 0,
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // columnas que tu DataTable espera (en ese orden)
  const TARGET_COLS = [
    "Nombres",
    "Apellidos",
    "CI",
    "Colegio",
    "Contacto_Tutor",
    "Unidad_Educativa",
    "Departamento",
    "Grado_Escolaridad",
    "Área",
    "Tutor_Académico",
  ];

  useEffect(() => {
    (async () => {
      try {
        const r = await getDashboardStats();
        if (r?.ok) setTotals(r.data);
      } catch (err) {
        // Manejo no bloqueante
        console.debug("No se pudieron cargar las stats:", err);
        // opcional: un aviso suave
        setMsg("No se pudieron cargar las estadísticas del dashboard.");
      }
    })();
  }, []);

  // ---- Vista previa local ----
  function handleSelect(file) {
    if (!file) {
      setPreviewRows([]);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      // Si usan ; como separador, descomenta:
      // delimiter: ";",
      transformHeader: (h) => (h || "").trim(),
      complete: ({ data }) => {
        // 1) normalizamos keys del CSV a nuestras TARGET_COLS
        const mapKey = (k) => {
          const key = (k || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // sin acentos
            .replace(/\s+/g, "_"); // espacios -> _
          const ALIAS = {
            nombres: "Nombres",
            apellidos: "Apellidos",
            ci: "CI",
            cedula: "CI",
            colegio: "Colegio",
            contacto_tutor: "Contacto_Tutor",
            celular_tutor: "Contacto_Tutor",
            telefono_tutor: "Contacto_Tutor",
            unidad_educativa: "Unidad_Educativa",
            u_e: "Unidad_Educativa",
            departamento: "Departamento",
            grado_escolaridad: "Grado_Escolaridad",
            grado: "Grado_Escolaridad",
            area: "Área",
            tutor_academico: "Tutor_Académico",
            tutor: "Tutor_Académico",
          };
          return ALIAS[key] || null; // si no encontramos alias, lo ignoramos
        };

        // 2) construimos filas solo con las columnas esperadas
        const rows = (data || []).slice(0, 100).map((row) => {
          const out = Object.fromEntries(TARGET_COLS.map((c) => [c, ""]));
          Object.entries(row).forEach(([k, v]) => {
            const target = mapKey(k);
            if (target) out[target] = (v ?? "").toString().trim();
          });
          return out;
        });

        setPreviewRows(rows);
        setMsg(
          rows.length
            ? `Previsualizando ${rows.length} fila(s)`
            : "El archivo no tiene filas."
        );
      },
      error: (err) => {
        setMsg(`❌ Error al leer CSV: ${err.message}`);
        setPreviewRows([]);
      },
    });
  }

  // ---- Import real al backend ----
  async function handleConfirm(file) {
    try {
      setLoading(true);
      setMsg("Importando...");
      const r = await importInscritosCsv(file);
      if (r?.ok) {
        const { total, importados, errores } = r.data;
        setMsg(`✅ Importados: ${importados}/${total}. Errores: ${errores}.`);
        const s = await getDashboardStats().catch(() => null);
        if (s?.ok) setTotals(s.data);
      } else {
        setMsg("❌ Hubo un problema al importar.");
      }
    } catch (e) {
      setMsg(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 5000);
    }
  }

  return (
    <div className="container-app">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto px-4 py-5 space-y-4">
            <h1 className="text-sm font-semibold text-gray-600">Dashboard</h1>
            <StatsStrip totals={totals} />
            {msg && (
              <div className={`card px-4 py-3 ${loading ? "opacity-90" : ""}`}>
                <p className="text-sm">{msg}</p>
              </div>
            )}
            <ImportCsvCard onSelect={handleSelect} onConfirm={handleConfirm} />
            <DataTable rows={previewRows} /> {/* tu tabla existente */}
          </div>
        </main>
      </div>
    </div>
  );
}