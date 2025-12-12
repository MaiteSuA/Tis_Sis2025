import { useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";

const MOCK_OLIMPIADAS = [
  {
    id: 1,
    nombre: "Olimpiadas Verano 2025",
    estado: "Activa",
    colorEstado: "bg-emerald-100 text-emerald-700",
    fechas: "2025-11-01 - 2025-11-28",
    areas: ["Astronomía", "Biología", "Física", "Informática", "Matemática", "Química", "Robótica", "Astrofísica"],
  },
  {
    id: 2,
    nombre: "Olimpiada Invierno 2026",
    estado: "En planificación",
    colorEstado: "bg-rose-100 text-rose-600",
    fechas: "2026-07-01 - 2026-07-31",
    areas: ["Astronomía", "Biología", "Física", "Informática", "Matemática", "Química", "Astrofísica"],
  },
];

export default function AdminLog() {
  const [olimpiadas] = useState(MOCK_OLIMPIADAS);
  const [showModal, setShowModal] = useState(false);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState(null);

  // estado del formulario
  const [nombre, setNombre] = useState("");
  const [fases, setFases] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areas, setAreas] = useState([]);
  const [errores, setErrores] = useState({});

  const AREAS_DISPONIBLES = [
    "Astronomía",
    "Biología",
    "Física",
    "Informática",
    "Matemática",
    "Química",
    "Robótica",
    "Astrofísica",
  ];

  const abrirModal = (oli) => {
    setOlimpiadaSeleccionada(oli);
    setNombre(oli?.nombre || "");
    setFases("");
    setFechaInicio("");
    setFechaFin("");
    setAreas([]);
    setErrores({});
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setOlimpiadaSeleccionada(null);
  };

  const toggleArea = (area) => {
    setAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleCrear = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre de la olimpiada es obligatorio";
    if (!fases || Number(fases) < 2)
      nuevosErrores.fases = "El número de etapas es obligatorio (mínimo 2)";
    if (!fechaInicio) nuevosErrores.fechaInicio = "La fecha de inicio es obligatoria";
    if (!fechaFin) nuevosErrores.fechaFin = "La fecha de finalización es obligatoria";
    if (!areas.length) nuevosErrores.areas = "Selecciona al menos un área";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    console.log("Datos enviados:", {
      nombre,
      fases,
      fechaInicio,
      fechaFin,
      areas,
      olimpiadaBase: olimpiadaSeleccionada,
    });

    cerrarModal();
  };

  return (
    <AdminLayout>
      <div className="text-xs text-gray-500 mb-2">
        Dashboard / Configurar Gestión
      </div>

      <section className="space-y-4">
        <h1 className="text-base font-semibold text-gray-800">
          Configurar Gestión
        </h1>
        <p className="text-sm text-gray-600">
          Selecciona una olimpiada para configurar su gestión.
        </p>

        {/* GRID DE CARDS */}
        <div className="grid gap-4 md:grid-cols-2">
          {olimpiadas.map((oli) => (
            <article
              key={oli.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    {oli.nombre}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fechas: {oli.fechas}
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${oli.colorEstado}`}
                >
                  {oli.estado}
                </span>
              </div>

              {/* Botón inferior, sin “Áreas asignadas” */}
              <button
                type="button"
                onClick={() => abrirModal(oli)}
                className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-gray-900 text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Configurar Gestión
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* MODAL FORMULARIO CREAR OLIMPIADA */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-800">
                {olimpiadaSeleccionada
                  ? `Configurar olimpiada: ${olimpiadaSeleccionada.nombre}`
                  : "Crear olimpiada"}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCrear} className="px-5 py-4 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre Olimpiada
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errores.nombre
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Olimpiada Nacional de Tecnología 2025"
                />
                {errores.nombre && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errores.nombre}
                  </p>
                )}
              </div>

              {/* Número de fases */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número de Fases
                </label>
                <input
                  type="number"
                  min={2}
                  value={fases}
                  onChange={(e) => setFases(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errores.fases
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Ingrese el número de etapas (mínimo 2)"
                />
                {errores.fases && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errores.fases}
                  </p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errores.fechaInicio
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-indigo-200"
                    }`}
                  />
                  {errores.fechaInicio && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errores.fechaInicio}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha de finalización
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errores.fechaFin
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-indigo-200"
                    }`}
                  />
                  {errores.fechaFin && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errores.fechaFin}
                    </p>
                  )}
                </div>
              </div>

              {Object.keys(errores).length > 0 && (
                <p className="text-[11px] text-red-500">
                  Corrige los errores antes de continuar.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-dark px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Crear olimpiada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


