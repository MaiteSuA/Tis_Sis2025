import React, { useEffect, useState } from "react";
import Header from "../components/header"; 
import EvaluadorForm from "../components/EvaluadorForm.jsx";

const RevisarEvaluaciones = () => {
  // Estado que guarda la lista de competidores
  const [competidores, setCompetidores] = useState([]);
  const [areas, setAreas] = useState([]);

  // Estados para manejar el modal del formulario de evaluadores
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);

  // Traer las áreas desde la API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/areas`);
        const data = await res.json();

        if (data.ok && Array.isArray(data.data)) {
          const formatted = data.data.map((a) => ({
            id: parseInt(a.id_area),
            nombre: a.nombre_area,
          }));
          setAreas(formatted);
        } else {
          console.error("Error: formato de datos incorrecto");
        }
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);


  // Abre el modal en modo "crear nuevo evaluador"
  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  // Guarda un nuevo evaluador llamando a la API
  const handleSave = async (formDelModal) => {
    try {
      const payloadEval = {
        nombres: formDelModal.nombres,
        apellidos: formDelModal.apellidos,
        id_area: Number(formDelModal.areaId),
      };

      await createEvaluador(payloadEval);
      alert("Evaluador registrado correctamente.");
      setShowForm(false);
    } catch (e) {
      console.error("Error al guardar:", e);
      alert("No se pudo registrar el evaluador.");
    }
  };

  // Obtiene los datos de las evaluaciones al cargar la página
  useEffect(() => {
    const fetchCompetidores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/evaluaciones`);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const result = await response.json();
        if (result.ok) setCompetidores(result.data);
        else throw new Error("Error en la respuesta del servidor");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetidores();
  }, []);


  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Header fijo */}
      <Header />

      {/* Contenido principal */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="!bg-white p-6 rounded-2xl shadow-lg mb-6">
          {/* Encabezado del panel */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Área: Química</h2>
              <p className="text-gray-500">Estado: Pendiente de Cierre</p>
            </div>
            
          </div>

          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="!bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Resumen</h3>
              <ul className="text-gray-700">
                <li>Competidores: </li>
                <li>Clasificados: </li>
                <li>Evaluaciones: </li>
              </ul>
              <button className="mt-3 !bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Ver Reporte
              </button>
              
            </div>
            <div className="!bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Cierre de Fase</h3>
              <ul className="text-gray-700 space-y-1">
                <li>Todas las evaluaciones registradas</li>
                <li>No existen pendientes</li>
                <li>Se han revisado observaciones</li>
              </ul>
              <button className="mt-3 !bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Concluir Fase
              </button>
            </div>
          </div>

          {/* Tabla de resultados */}
          <h3 className="text-lg font-bold mb-3">Resultados Clasificatoria</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead className="!bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Competidor</th>
                  <th className="p-3 text-left">Nota</th>
                  <th className="p-3 text-left">Observaciones</th>
                  <th className="p-3 text-left">Estado</th>
                </tr>
              </thead>
              
              <tbody>
                {competidores.map((c, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{c.competidor}</td>
                      <td className="p-3">{c.nota}</td>
                      <td className="p-3">{c.observacion}</td>
                      <td className="p-3">{c.estado}</td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
          </div>

          {/* Botones inferiores */}
          <div className="flex flex-wrap justify-between mt-6">
            <div className="flex gap-2">
              <button className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Exportar Excel</button>
              <button className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Autorizar Publicación</button>
            </div>
            <button 
              className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              onClick={handleCreate}
            >
              Registrar Evaluador
            </button>
          </div>

          {showForm && (
            <EvaluadorForm
              key={mode + (selected?.id ?? "nuevo")}
              mode={mode}
              title="Registro de Evaluador"
              areas={areas}
              initialData={selected}
              defaultRol="EVALUADOR"
              onSubmit={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelected(null);
              }}
            />
          )}    

        </div>
      </div>
    </div>
  );
};

export default RevisarEvaluaciones;