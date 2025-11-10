import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import StatsStrip from "../components/StatsStrip";
import ImportCsvCard from "../components/ImportCsvCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import { importInscritosCsv, getDashboardStats } from "../services/api";
import Papa from "papaparse";

export default function ImportarInscritos() {
  const navigate = useNavigate();

  const [previewRows, setPreviewRows] = useState([]);
  const [totals, setTotals] = useState({ total: 0, clasificados: 0, reportes: 0 });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // filtros y selección
  const [filters, setFilters] = useState({ area: null, nivel: null });
  const [selected, setSelected] = useState(new Set());

  // columnas esperadas por la tabla
  const TARGET_COLS = [
    "Nombres","Apellidos","CI","Colegio","Contacto_Tutor","Unidad_Educativa",
    "Departamento","Grado_Escolaridad","Área","Tutor_Académico",
  ];

  useEffect(() => {
    (async () => {
      try {
        const r = await getDashboardStats();
        if (r?.ok) setTotals(r.data);
      } catch (err) {
        console.debug("No se pudieron cargar las stats:", err);
        setMsg("No se pudieron cargar las estadísticas del dashboard.");
      }
    })();
  }, []);

  // ---- Vista previa local ----
  function handleSelect(file) {
    if (!file) { setPreviewRows([]); setSelected(new Set()); return; }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => (h || "").trim(),
      complete: ({ data }) => {
        const mapKey = (k) => {
          const key = (k || "")
            .trim().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_");
          const ALIAS = {
            nombres:"Nombres", apellidos:"Apellidos", ci:"CI", cedula:"CI",
            colegio:"Colegio", contacto_tutor:"Contacto_Tutor",
            celular_tutor:"Contacto_Tutor", telefono_tutor:"Contacto_Tutor",
            unidad_educativa:"Unidad_Educativa", u_e:"Unidad_Educativa",
            departamento:"Departamento",
            grado_escolaridad:"Grado_Escolaridad", grado:"Grado_Escolaridad",
            area:"Área",
            tutor_academico:"Tutor_Académico", tutor:"Tutor_Académico",
          };
          return ALIAS[key] || null;
        };

        const rows = (data || []).slice(0, 300).map((row) => {
          const out = Object.fromEntries(TARGET_COLS.map((c) => [c, ""]));
          Object.entries(row).forEach(([k, v]) => {
            const target = mapKey(k);
            if (target) out[target] = (v ?? "").toString().trim();
          });
          return out;
        });

        setPreviewRows(rows);
        setSelected(new Set());
        setMsg(rows.length ? `Previsualizando ${rows.length} fila(s)` : "El archivo no tiene filas.");
      },
      error: (err) => {
        setMsg(`❌ Error al leer CSV: ${err.message}`);
        setPreviewRows([]); setSelected(new Set());
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
      } else setMsg("❌ Hubo un problema al importar.");
    } catch (e) {
      setMsg(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 5000);
    }
  }

  // valores únicos para filtros
  const areas = useMemo(
    () => Array.from(new Set(previewRows.map(r => r["Área"]).filter(Boolean))).sort(),
    [previewRows]
  );
  const niveles = useMemo(
    () => Array.from(new Set(previewRows.map(r => r["Grado_Escolaridad"]).filter(Boolean))).sort(),
    [previewRows]
  );

  // aplicar filtros
  const filteredRows = useMemo(() => {
    return previewRows.filter(r => {
      if (filters.area && r["Área"] !== filters.area) return false;
      if (filters.nivel && r["Grado_Escolaridad"] !== filters.nivel) return false;
      return true;
    });
  }, [previewRows, filters]);

  // selección (considera índices de la lista completa)
  function toggleRow(idxInFiltered) {
    const realIndex = previewRows.indexOf(filteredRows[idxInFiltered]);
    const next = new Set(selected);
    if (next.has(realIndex)) next.delete(realIndex);
    else next.add(realIndex);
    setSelected(next);
  }
  function toggleAll() {
    if (filteredRows.length === 0) return;
    const allSelected = filteredRows.every(r => selected.has(previewRows.indexOf(r)));
    const next = new Set(selected);
    if (allSelected) filteredRows.forEach(r => next.delete(previewRows.indexOf(r)));
    else filteredRows.forEach(r => next.add(previewRows.indexOf(r)));
    setSelected(next);
  }

  // limpiar lista
  function clearList() {
    setPreviewRows([]);
    setSelected(new Set());
    setFilters({ area: null, nivel: null });
    setMsg("Lista limpiada.");
    setTimeout(() => setMsg(""), 3000);
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

            {/* Importar */}
            <ImportCsvCard onSelect={handleSelect} onConfirm={handleConfirm} />

            {/* Filtros + Acciones */}
            <div className="flex items-center gap-3">
              <FilterBar
                areas={areas}
                niveles={niveles}
                filters={filters}
                onChange={setFilters}
              />
              <div className="ml-auto flex items-center gap-3">
                <button className="btn" onClick={clearList}>Limpiar lista</button>
              </div>
            </div>

            {/* Tabla */}
            <DataTable
              rows={filteredRows}
              selected={selected}
              onToggleRow={(idx) => toggleRow(idx)}
              onToggleAll={toggleAll}
            />

            {/* Exportar / Reportes → vistas temporales */}
            <div className="card px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="font-semibold">Exportar / Reportes:</div>
              <button className="btn" onClick={() => navigate("/temporal/reportes-de-clasificados")}>
                Reportes de Clasificados
              </button>
              <button className="btn" onClick={() => navigate("/temporal/reportes-de-no-clasificados")}>
                Reportes de No clasificados
              </button>
              <button className="btn" onClick={() => navigate("/temporal/reporte-desclasificados")}>
                Reporte desclasificados
              </button>
            </div>

            {/* Fase final → vistas temporales */}
            <div className="card px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="font-semibold">Fase final</div>
              <button className="btn" onClick={() => navigate("/temporal/lista-de-clasificados-confirmados")}>
                Ver Lista de Clasificados Confirmados
              </button>
              <button className="btn" onClick={() => navigate("/temporal/habilitar-fase-final")}>
                Habilitar fase final
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
