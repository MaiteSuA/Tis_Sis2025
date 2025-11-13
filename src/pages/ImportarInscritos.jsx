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
import AssignEvaluatorBar from "../components/AssignEvaluatorBar";

/**
 * Pantalla de Coordinador para:
 * - Previsualizar un CSV localmente (sin tocar la BD)
 * - Filtrar por Área y Nivel
 * - Seleccionar filas con checkboxes
 * - (Más adelante) Enviar filas filtradas/seleccionadas a un evaluador
 */

export default function ImportarInscritos() {
  const navigate = useNavigate();

  // Estado base del dashboard
  const [previewRows, setPreviewRows] = useState([]);
  const [totals, setTotals] = useState({
    total: 0,
    clasificados: 0,
    reportes: 0,
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // filtros y selección
  const [filters, setFilters] = useState({ area: null, nivel: null });
  const [selected, setSelected] = useState(new Set());

  // Evaluador elegido en el combo
  const [selectedEval, setSelectedEval] = useState(null); // 👈 nuevo

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

  // Mock de evaluadores
  const EVALUADORES = [
    { id: "eva-mate-1", area: "Matemática", nombre: "Ana Pérez" },
    { id: "eva-fis-1", area: "Física", nombre: "Luis Soto" },
    { id: "eva-qui-1", area: "Química", nombre: "María Gómez" },
    { id: "eva-bio-1", area: "Biología", nombre: "Diego Rivera" },
    { id: "eva-info-1", area: "Informática", nombre: "Camila Rojas" },
    { id: "eva-rob-1", area: "Robótica", nombre: "Jorge Vargas" },
  ];

  /**
   * useMemo: devuelve los evaluadores visibles según el filtro de Área.
   * Evita recalcular en cada render si el área no cambió.
   */
  const evaluadoresFiltrados = useMemo(() => {
    if (!filters.area) return EVALUADORES;
    return EVALUADORES.filter((e) => e.area === filters.area);
  }, [filters.area]);

  /**
   * useEffect: carga las métricas del dashboard al montar el componente.
   * En caso de error, no rompe la pantalla: muestra un aviso suave.
   */
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

  /**
   * handleSelect: lee el CSV local y genera la previsualización.
   * - NO envía datos al backend (seguro)
   * - Normaliza encabezados variables del CSV a las columnas TARGET_COLS
   * - Mantiene un máximo de 300 filas en la vista previa por performance
   */
  function handleSelect(file) {
    if (!file) {
      setPreviewRows([]);
      setSelected(new Set());
      return;
    }

    Papa.parse(file, {
      header: true, // Usa la primera fila como cabecera
      skipEmptyLines: true, // Ignora filas vacías
      transformHeader: (h) => (h || "").trim(), // Limpia espacios en headers
      complete: ({ data }) => {
        const mapKey = (k) => {
          /**
           * mapKey: normaliza un nombre de columna libre del CSV
           * a una de las claves oficiales de la tabla.
           * Reglas:
           * - minúsculas
           * - sin acentos
           * - espacios -> guión bajo
           * - mapeo por ALIAS ("cedula" -> "CI")
           */
          const key = (k || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // quita acentos
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
          return ALIAS[key] || null; // si no hay mapeo, la columna se ignora
        };

        // Convierte cada fila cruda del CSV a un objeto con las TARGET_COLS
        const rows = (data || []).slice(0, 300).map((row) => {
          const out = Object.fromEntries(TARGET_COLS.map((c) => [c, ""]));
          Object.entries(row).forEach(([k, v]) => {
            const target = mapKey(k);
            if (target) out[target] = (v ?? "").toString().trim();
          });
          return out;
        });

        setPreviewRows(rows); // pinta la previsualización
        setSelected(new Set()); // limpia selección previa
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

  // ---- Import real al backend ----
  // (la función de importación vive aquí debajo; cuando se activa,
  //  puedes reutilizar filteredRows/selected para decidir qué enviar)

  async function handleConfirm(file) {
    try {
      // 1) calcular qué filas se importan:
      // - si el usuario marcó checkboxes, usamos esas
      // - si no marcó nada, importamos todas las filas que pasan los filtros
      let indexes = [];
      if (selected.size > 0) {
        indexes = Array.from(selected); // ya son índices de previewRows
      } else {
        // Mapear cada fila filtrada a su índice real en previewRows
        indexes = filteredRows.map((r) => previewRows.indexOf(r));
      }

      setLoading(true);
      setMsg("Importando...");

      // 2) Llamada al servicio (puedes enviar también filtros e índices seleccionados)
      const r = await importInscritosCsv({
        file, // archivo original
        area: filters.area || undefined, // filtro activo
        nivel: filters.nivel || undefined, // filtro activo
        selectedIndexes: indexes, // QUÉ filas importar
      });

      // 3) Feedback al usuario + refresco de métricas del dashboard
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

  /**
   * Valores únicos para los combos de filtro:
   * - areas: único por columna "Área"
   * - niveles: único por columna "Grado_Escolaridad"
   * useMemo evita recalcular si previewRows no cambia.
   */
  const areas = useMemo(
    () =>
      Array.from(
        new Set(previewRows.map((r) => r["Área"]).filter(Boolean))
      ).sort(),
    [previewRows]
  );
  const niveles = useMemo(
    () =>
      Array.from(
        new Set(previewRows.map((r) => r["Grado_Escolaridad"]).filter(Boolean))
      ).sort(),
    [previewRows]
  );

  /**
   * Aplica filtros actuales sobre la previsualización completa.
   * Devuelve SOLO las filas visibles.
   * useMemo evita recomputar si no cambian previewRows o filters.
   */
  const filteredRows = useMemo(() => {
    return previewRows.filter((r) => {
      if (filters.area && r["Área"] !== filters.area) return false;
      if (filters.nivel && r["Grado_Escolaridad"] !== filters.nivel)
        return false;
      return true;
    });
  }, [previewRows, filters]);

  /**
   * Selección de una fila:
   * - El checkbox actúa sobre el índice RELATIVO del filtrado (idxInFiltered),
   *   por eso mapeamos a índice REAL en previewRows.
   * - Guardamos la selección como Set de índices reales para que sea estable
   *   aunque cambien los filtros.
   */
  function toggleRow(idxInFiltered) {
    const realIndex = previewRows.indexOf(filteredRows[idxInFiltered]);
    const next = new Set(selected);
    if (next.has(realIndex)) next.delete(realIndex);
    else next.add(realIndex);
    setSelected(next);
  }

  /**
   * Seleccionar / deseleccionar TODO lo visible:
   * - Si TODAS las filas filtradas ya están en 'selected', las quitamos.
   * - Si falta alguna, seleccionamos todas las filtradas.
   * - Siempre trabajamos con índices REALES de previewRows.
   */
  function toggleAll() {
    if (filteredRows.length === 0) return;
    const allSelected = filteredRows.every((r) =>
      selected.has(previewRows.indexOf(r))
    );
    const next = new Set(selected);
    if (allSelected)
      // Quitar todos los visibles
      filteredRows.forEach((r) => next.delete(previewRows.indexOf(r)));
    // Agregar todos los visibles
    else filteredRows.forEach((r) => next.add(previewRows.indexOf(r)));
    setSelected(next);
  }

  /**
   * Limpia toda la previsualización y los filtros activos.
   * - Vacía la lista de inscritos previsualizados.
   * - Reinicia la selección y los filtros (área, nivel).
   * - Muestra un mensaje temporal de confirmación.
   */
  function clearList() {
    setPreviewRows([]); // Borra todas las filas previsualizadas.
    setSelected(new Set()); // Quita todas las filas seleccionadas.
    setFilters({ area: null, nivel: null }); // Reinicia los filtros del combobox.
    setMsg("Lista limpiada."); // Mensaje de estado para el usuario.
    setTimeout(() => setMsg(""), 3000); // Borra el mensaje después de 3 segundos.
  }

  /**
   * Envía (simuladamente en front) las filas filtradas o seleccionadas
   * al evaluador de área elegido en el combobox.
   *
   * - Si no se elige evaluador, muestra advertencia.
   * - Si hay filas seleccionadas (checkbox), envía solo esas.
   * - Si no hay selección, envía todas las filas filtradas actualmente.
   * - Crea un payload con todos los datos listos para enviar al backend.
   * - Muestra mensaje de confirmación visual (sin conexión real todavía).
   */
  function handleSendToEvaluator() {
    // Verificación obligatoria: debe elegirse un evaluador antes de enviar
    if (!selectedEval) {
      setMsg("⚠️ Selecciona un evaluador de área.");
      return;
    }

    // Determinar qué filas se enviarán:
    // - Si hay checkboxes marcados: solo esas filas
    // - Si no hay selección: todas las que pasan los filtros
    const selectedInFiltered = filteredRows.filter(
      (r) => selected.has(previewRows.indexOf(r)) // revisa si el índice real está en el set
    );
    const rowsToSend = selectedInFiltered.length
      ? selectedInFiltered
      : filteredRows;

    // Construir el payload de envío (estructura lista para un POST futuro
    const payload = {
      evaluadorId: selectedEval,
      filtros: { area: filters.area, nivel: filters.nivel },
      total: rowsToSend.length,
      filas: rowsToSend.map((r) => ({
        Nombres: r.Nombres,
        Apellidos: r.Apellidos,
        CI: r.CI,
        Area: r["Área"],
        Grado: r["Grado_Escolaridad"],
        Colegio: r.Colegio,
      })),
    };

    console.log("📦 Envío a evaluador (solo front):", payload);
    setMsg(
      `📨 Se enviaron ${payload.total} fila(s) al evaluador seleccionado.`
    );
    setTimeout(() => setMsg(""), 5000);
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
                <button className="btn" onClick={clearList}>
                  Limpiar lista
                </button>
              </div>
            </div>

            {/* Asignar a evaluador */}
            <AssignEvaluatorBar
              evaluadores={evaluadoresFiltrados} // o EVALUADORES si no quieres filtrar por área
              value={selectedEval}
              onChange={setSelectedEval}
              onSend={handleSendToEvaluator}
              disabled={filteredRows.length === 0}
              count={
                filteredRows.filter((r) => selected.has(previewRows.indexOf(r)))
                  .length || filteredRows.length
              }
            />

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
              <button
                className="btn"
                onClick={() => navigate("/temporal/reportes-de-clasificados")}
              >
                Reportes de Clasificados
              </button>
              <button
                className="btn"
                onClick={() =>
                  navigate("/temporal/reportes-de-no-clasificados")
                }
              >
                Reportes de No clasificados
              </button>
              <button
                className="btn"
                onClick={() => navigate("/temporal/reporte-desclasificados")}
              >
                Reporte desclasificados
              </button>
            </div>

            {/* Fase final → vistas temporales */}
            <div className="card px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="font-semibold">Fase final</div>
              <button
                className="btn"
                onClick={() =>
                  navigate("/temporal/lista-de-clasificados-confirmados")
                }
              >
                Ver Lista de Clasificados Confirmados
              </button>
              <button
                className="btn"
                onClick={() => navigate("/temporal/habilitar-fase-final")}
              >
                Habilitar fase final
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
