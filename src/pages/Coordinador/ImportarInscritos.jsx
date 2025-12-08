import { useEffect, useMemo, useState } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";
import StatsStrip from "../../components/coordinador/StatsStrip";
import ImportCsvCard from "../../components/coordinador/ImportCsvCard";
import DataTable from "../../components/coordinador/DataTable";
import FilterBar from "../../components/coordinador/FilterBar";
import {
  importInscritosCsv,
  getDashboardStats,
  getAreas,
} from "../../services/api";
import Papa from "papaparse";

/**
 * Pantalla de Coordinador para:
 * - Previsualizar un CSV localmente (sin tocar la BD)
 * - Filtrar por Área y Nivel
 * - Seleccionar filas con checkboxes
 */
export default function ImportarInscritos() {
  // Estado base del dashboard
  const [previewRows, setPreviewRows] = useState([]);
  const [totals, setTotals] = useState({
    total: 0,
    clasificados: 0,
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // filtros y selección
  const [filters, setFilters] = useState({ area: null, nivel: null });
  const [selected, setSelected] = useState(new Set());

  // catálogo de áreas desde la BD
  const [areasCatalog, setAreasCatalog] = useState([]);

  // columnas esperadas por la tabla (cabecera fija de la previsualización)
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

  // ── Cargar estadísticas del dashboard.
  useEffect(() => {
    (async () => {
      try {
        const r = await getDashboardStats();
        if (r?.data) {
          setTotals(r.data);
        }
      } catch (err) {
        console.debug("No se pudieron cargar las stats:", err);
        setMsg("No se pudieron cargar las estadísticas del dashboard.");
      }
    })();
  }, []);

  // ── Cargar ÁREAS desde la BD (como en GestionarInscritos)
  useEffect(() => {
    (async () => {
      try {
        const areasData = await getAreas();
        console.log(
          "📌 ÁREAS desde getAreas() en ImportarInscritos:",
          areasData
        );

        // Si áreasData ya es un array (como en GestionarInscritos), lo guardamos tal cual.
        const lista = Array.isArray(areasData)
          ? areasData
          : areasData?.data ?? [];

        setAreasCatalog(lista);
      } catch (e) {
        console.error("Error cargando áreas en ImportarInscritos:", e);
      }
    })();
  }, []);

  /**
   * handleSelect: lee el CSV local y genera la previsualización.
   */
  function handleSelect(file) {
    if (!file) {
      setPreviewRows([]);
      setSelected(new Set());
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => (h || "").trim(),
      complete: ({ data }) => {
        const mapKey = (k) => {
          const key = (k || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_");
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
        setMsg(
          rows.length
            ? `Previsualizando ${rows.length} fila(s)`
            : "El archivo no tiene filas."
        );
      },
      error: (err) => {
        setMsg(`❌ Error al leer CSV: ${err.message}`);
        setPreviewRows([]);
        setSelected(new Set());
      },
    });
  }

  // ─────────────── Import real al backend ───────────────
  async function handleConfirm(file) {
    try {
      let indexes = [];
      if (selected.size > 0) {
        indexes = Array.from(selected);
      } else {
        indexes = filteredRows.map((r) => previewRows.indexOf(r));
      }

      setLoading(true);
      setMsg("Importando...");

      const selectedCis = indexes.map(i => previewRows[i]["CI"]);

      const r = await importInscritosCsv({
        file,
        area: filters.area || undefined,
        nivel: filters.nivel || undefined,
        /* selectedIndexes: indexes, */
        selectedCis,
      });

      if (r?.ok) {
        const { total, importados, yaRegistrados = 0, errores = 0 } = r.data;

        const correctos = importados;

        setMsg(
          `✅ Importados: ${correctos}` +
            ` | 📂 Ya registrados: ${yaRegistrados}` +
            ` | ❌ Errores: ${errores}` +
            ` | Total filas: ${total}`
        );

        const s = await getDashboardStats().catch(() => null);
        if (s?.ok && s.data) setTotals(s.data);
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

  // ─────────────── Niveles (estos sí siguen saliendo del CSV) ───────────────
  const niveles = useMemo(
    () =>
      Array.from(
        new Set(previewRows.map((r) => r["Grado_Escolaridad"]).filter(Boolean))
      ).sort(),
    [previewRows]
  );

  // ─────────────── OPCIONES DE ÁREA (BD + fallback CSV) ───────────────
  const areasOptions = useMemo(() => {
    // Si la BD devolvió algo, usamos eso
    if (Array.isArray(areasCatalog) && areasCatalog.length > 0) {
      return areasCatalog;
    }

    // Fallback: construir a partir del CSV para no dejar el combo vacío
    const fromCsv = Array.from(
      new Set(previewRows.map((r) => r["Área"]).filter(Boolean))
    ).sort();

    return fromCsv.map((nombre, idx) => ({
      id_area: `csv-${idx}`,
      nombre_area: nombre,
    }));
  }, [areasCatalog, previewRows]);

  // ─────────────── Aplicar filtros ───────────────
  const filteredRows = useMemo(() => {
    return previewRows.filter((r) => {
      if (filters.area && r["Área"] !== filters.area) return false;
      if (filters.nivel && r["Grado_Escolaridad"] !== filters.nivel)
        return false;
      return true;
    });
  }, [previewRows, filters]);

  // ─────────────── Selección (checkboxes) ───────────────
  function toggleRow(idxInFiltered) {
    const realIndex = previewRows.indexOf(filteredRows[idxInFiltered]);
    const next = new Set(selected);
    if (next.has(realIndex)) next.delete(realIndex);
    else next.add(realIndex);
    setSelected(next);
  }

  function toggleAll() {
    if (filteredRows.length === 0) return;
    const allSelected = filteredRows.every((r) =>
      selected.has(previewRows.indexOf(r))
    );
    const next = new Set(selected);
    if (allSelected)
      filteredRows.forEach((r) => next.delete(previewRows.indexOf(r)));
    else filteredRows.forEach((r) => next.add(previewRows.indexOf(r)));
    setSelected(next);
  }

  // ─────────────── Limpiar lista ───────────────
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
                areas={areasOptions} // 👈 ya mezclado BD + fallback
                niveles={niveles}
                filters={filters}
                onChange={setFilters}
              />
              <div className="ml-auto flex items-center gap-3">
                <button className="btn" onClick={clearList}>
                  Limpiar lista
                </button>
              </div>
            </div>

            {/* Tabla */}
            <DataTable
              rows={filteredRows}
              previewRows={previewRows}
              selected={selected}
              onToggleRow={(idx) => toggleRow(idx)}
              onToggleAll={toggleAll}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
