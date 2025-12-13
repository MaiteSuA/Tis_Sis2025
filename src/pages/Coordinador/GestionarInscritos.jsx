// src/pages/coordinador/GestionarInscritos.jsx
import { useEffect, useState } from "react";
import {
  getInscritos,
  assignInscritosToEvaluador,
  getAreas,
} from "../../services/api";
import { getEvaluadores } from "../../api/evaluadores";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";

const getInscritoId = (ins) =>
  ins.id_inscritos ?? ins.id_inscrito ?? ins.id ?? ins.idInscrito;

export default function GestionarInscritos() {
  // filtros
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [nivel, setNivel] = useState("");
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");
  const [soloSinEvaluador, setSoloSinEvaluador] = useState(true);

  // datos
  const [inscritos, setInscritos] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);
  const [idEvaluadorSeleccionado, setIdEvaluadorSeleccionado] = useState("");

  // selección
  const [selected, setSelected] = useState(new Set());

  // estado UI
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [assignInfo, setAssignInfo] = useState("");

  // Cargar evaluadores + áreas al entrar
  useEffect(() => {
    (async () => {
      try {
        const [evaluadoresData, areasData] = await Promise.all([
          getEvaluadores(),
          getAreas(),
        ]);

        const listaEvaluadores = Array.isArray(evaluadoresData?.data)
          ? evaluadoresData.data
          : Array.isArray(evaluadoresData)
          ? evaluadoresData
          : [];

        const listaAreas = Array.isArray(areasData?.data)
          ? areasData.data
          : Array.isArray(areasData)
          ? areasData
          : [];

        setEvaluadores(listaEvaluadores);
        setAreas(listaAreas);
      } catch (e) {
        console.error(e);
        setError("Error cargando catálogos (áreas/evaluadores)");
      }
    })();
  }, []);

  const buscarInscritos = async () => {
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const data = await getInscritos({
        area,
        nivel,
        estado,
        search,
        soloSinEvaluador,
      });

      const lista = Array.isArray(data?.data) ? data.data : data ?? [];
      setInscritos(lista);
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al cargar inscritos");
    } finally {
      setLoading(false);
    }
  };

  // Si el filtro es FINALISTA, no ocultar por “soloSinEvaluador”
  useEffect(() => {
    if (estado === "FINALISTA" && soloSinEvaluador) {
      setSoloSinEvaluador(false);
    }
  }, [estado]); // eslint-disable-line react-hooks/exhaustive-deps

  // selección
  const toggleOne = (inscrito) => {
    const id = getInscritoId(inscrito);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      if (prev.size === inscritos.length) return new Set();
      return new Set(inscritos.map((i) => getInscritoId(i)));
    });
  };

  const handleAsignar = async () => {
    setError("");
    setMsg("");
    setAssignInfo("");

    if (!idEvaluadorSeleccionado) {
      setError("Selecciona un evaluador primero");
      return;
    }
    if (!selected.size) {
      setError("Selecciona al menos un inscrito");
      return;
    }

    const idsInscritos = Array.from(selected);

    try {
      setAssigning(true);

      await assignInscritosToEvaluador({
        idEvaluador: Number(idEvaluadorSeleccionado),
        idsInscritos,
        // mantener flags actuales
        replaceExisting: true,
        exclusive: true,
      });

      // ⬇️ Remover inmediatamente de la lista local para evitar reasignación doble
      setInscritos((prev) =>
        prev.filter((i) => !idsInscritos.includes(getInscritoId(i)))
      );
      setSelected(new Set());
      setAssignInfo("Inscritos asignados correctamente.");

      // ⬇️ Refetch para quedar consistentes con el backend
      await buscarInscritos();
    } catch (e) {
      console.error(e);
      setError("Error al asignar inscritos");
      setAssignInfo("Error al asignar inscritos");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopNav
        rightSlot={
          <span className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
            COORDINADOR
          </span>
        }
      />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 space-y-4">
          <header className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold">
              Gestionar Inscritos
            </h1>
            <button
              onClick={buscarInscritos}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Buscar"}
            </button>
          </header>

          {/* Filtros */}
          <section className="bg-white rounded-xl shadow p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Filtros de búsqueda
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="label">Área</label>
                <select
                  className="select select-bordered w-full"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="">Todas</option>
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area ?? a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Nivel</label>
                <select
                  className="select select-bordered w-full"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="label">Estado</label>
                <select
                  className="select select-bordered w-full"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ASIGNADO">Asignado</option>
                  <option value="FINALISTA">FINALISTA</option>
                </select>
              </div>

              <div>
                <label className="label">Buscar por CI / nombre</label>
                <input
                  className="input input-bordered w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="CI, nombre, unidad educativa..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={soloSinEvaluador}
                onChange={(e) => setSoloSinEvaluador(e.target.checked)}
              />
              <span className="text-sm text-gray-600">
                Mostrar solo inscritos sin evaluador asignado
              </span>
            </label>
          </section>

          {(error || msg) && (
            <div className="space-y-2">
              {error && (
                <div className="alert alert-error text-sm">{error}</div>
              )}
              {msg && <div className="alert alert-success text-sm">{msg}</div>}
            </div>
          )}

          {/* Tabla + panel de asignación */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Tabla */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-sm text-gray-600">
                  {inscritos.length
                    ? `Mostrando ${inscritos.length} inscritos`
                    : "Sin resultados aún"}
                  {soloSinEvaluador && inscritos.length === 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      ✓ Todos asignados
                    </span>
                  )}
                </div>
                {inscritos.length > 0 && (
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={toggleAll}
                  >
                    {selected.size === inscritos.length
                      ? "Quitar selección"
                      : "Seleccionar todos"}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          onChange={toggleAll}
                          checked={
                            inscritos.length > 0 &&
                            selected.size === inscritos.length
                          }
                        />
                      </th>
                      <th>CI</th>
                      <th>Nombre</th>
                      <th>Unidad / Colegio</th>
                      <th>Nivel</th>
                      <th>Área</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritos.map((ins) => {
                      const id = getInscritoId(ins);
                      const checked = selected.has(id);

                      // Mostrar "FINALISTA" si viene finalista: true (virtual)
                      const estadoUi = ins.finalista
                        ? "FINALISTA"
                        : ins.estado || "—";

                      return (
                        <tr key={id}>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={checked}
                              onChange={() => toggleOne(ins)}
                            />
                          </td>
                          <td>{ins.ci_inscrito || "-"}</td>
                          <td>
                            {ins.nombres_inscrito} {ins.apellidos_inscrito}
                          </td>
                          <td>{ins.unidad_educativa || "-"}</td>
                          <td>{ins.nivel || "-"}</td>
                          <td>{ins.area || "-"}</td>

                          <td>
                            <span
                              className={[
                                "px-2 py-0.5 rounded-full text-xs font-semibold",
                                estadoUi === "FINALISTA"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : estadoUi === "ASIGNADO"
                                  ? "bg-blue-100 text-blue-700"
                                  : estadoUi === "PENDIENTE"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-600",
                              ].join(" ")}
                            >
                              {estadoUi}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panel de asignación */}
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Asignar a evaluador
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  Seleccionados:{" "}
                  <span className="font-semibold">{selected.size}</span>
                </p>

                <label className="block text-sm">
                  <span className="label-text">Evaluador</span>
                  <select
                    className="select select-bordered w-full mt-1"
                    value={idEvaluadorSeleccionado}
                    onChange={(e) => setIdEvaluadorSeleccionado(e.target.value)}
                  >
                    <option value="">-- Selecciona evaluador --</option>
                    {evaluadores.map((ev) => {
                      const id = ev.id_evaluador ?? ev.id;

                      const nombreCompleto = [
                        ev.nombre_evaluado ?? ev.nombres ?? ev.nombre ?? "",
                        ev.apellidos_evaluador ??
                          ev.apellidos ??
                          ev.apellido ??
                          "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      const areaNombre =
                        (typeof ev.area === "string" && ev.area) ||
                        (ev.area && ev.area.nombre_area) ||
                        ev.area_nombre ||
                        "";

                      return (
                        <option key={id} value={id}>
                          {nombreCompleto}
                          {areaNombre ? ` (${areaNombre})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <button
                  className="btn btn-primary w-full mt-2"
                  disabled={assigning || !selected.size}
                  onClick={handleAsignar}
                >
                  {assigning
                    ? "Asignando..."
                    : "Asignar inscritos seleccionados"}
                </button>

                {assignInfo && (
                  <p className="text-xs mt-2 text-gray-700">{assignInfo}</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
