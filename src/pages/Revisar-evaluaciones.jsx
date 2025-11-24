import React, { useEffect, useState } from "react";
import Header from "../components/header";
import EvaluadorForm from "../components/EvaluadorForm.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Servicios
import {
  createEvaluador,
  getEvaluadores,
  updateEvaluador,
  deleteEvaluador,
} from "../api/evaluadores.js";

const RevisarEvaluaciones = () => {
  const [competidores, setCompetidores] = useState([]);
  const [areas, setAreas] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);

  const [evaluadores, setEvaluadores] = useState([]);
  const [loadingEvals, setLoadingEvals] = useState(true);

  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================== CARGAR EVALUADORES ======================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEvaluadores();
        setEvaluadores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvals(false);
      }
    };
    load();
  }, []);

  // ====================== EDITAR ======================
  const handleEdit = (item) => {
    setSelected(item);
    setMode("edit");
    setShowForm(true);
  };

  // ====================== ELIMINAR ======================
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este evaluador?")) return;

    try {
      await deleteEvaluador(id);
      setEvaluadores((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  // ====================== GUARDAR ======================
  const handleSave = async (formData) => {
    try {
      const payload = {
        nombre_evaluado: formData.nombres,
        apellidos_evaluador: formData.apellidos,
        id_area: Number(formData.areaId),
      };

      let saved;

      if (mode === "create") {
        saved = await createEvaluador(payload);

        // NORMALIZAR 
        const formateado = {
          id: saved.id_evaluador,
          nombres: saved.nombre_evaluador,
          apellidos: saved.apellidos_evaluador,
          area: saved.area_nombre
        };

        setEvaluadores((prev) => [...prev, saved]);
      } else {
        saved = await updateEvaluador(selected.id, payload);

        const formateado = {
    id: saved.id_evaluador,
    nombres: saved.nombre_evaluador,
    apellidos: saved.apellidos_evaluador,
    area: saved.area_nombre
  };

        setEvaluadores((prev) =>
          prev.map((e) => (e.id === selected.id ? saved : e))
        );
      }

      setShowForm(false);
      setSelected(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ====================== CARGAR ÁREAS ======================
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/areas`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.ok && Array.isArray(data.data)) {
          const formatted = data.data.map((a) => ({
            id: parseInt(a.id_area),
            nombre: a.nombre_area,
          }));
          setAreas(formatted);
        }
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  // ====================== CREAR ======================
  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  // ====================== CARGAR COMPETIDORES ======================
  useEffect(() => {
    const fetchCompetidores = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/evaluaciones`
        );
        const result = await response.json();

        if (!response.ok) throw new Error("Error al obtener los datos");

        if (result.ok) {
          setCompetidores(result.data);
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetidores();
  }, []);

  // ====================== EXPORTAR EXCEL ======================
  const exportExcel = () => {
    if (!competidores.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const data = competidores.map((c) => ({
      Competidor: c.competidor,
      Nota: c.nota,
      Observación: c.observacion,
      Estado: c.estado,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clasificatoria");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Resultados_Clasificatoria.xlsx");

    showToast("Excel descargado correctamente ✔");
  };

  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };


  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Header />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="!bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Área: Química</h2>
              <p className="text-gray-500">Estado: Pendiente de Cierre</p>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="!bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Resumen</h3>
              <ul className="text-gray-700">
                <li>Competidores: {competidores.length}</li>
                <li>
                  Clasificados:{" "}
                  {competidores.filter((c) => c.estado === "Clasificado").length}
                </li>
              </ul>
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

          {/* Tabla Clasificatoria */}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones debajo de tabla clasificatoria */}
          <div className="flex flex-wrap justify-between mt-6 mb-10">
            <div className="flex gap-2">
              <button
                onClick={exportExcel}
                className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Exportar Excel
              </button>

              <button
                className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Autorizar Publicación
              </button>
            </div>
          </div>

          {/* EVALUADORES */}
          <h3 className="text-lg font-bold mt-10 mb-3">
            Evaluadores Registrados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse shadow rounded-lg">
              <thead className="!bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nombres</th>
                  <th className="p-3 text-left">Apellidos</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-left">Área</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {!loadingEvals &&
                  evaluadores.map((e) => (
                    <tr key={e.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{e.id}</td>
                      <td className="p-3">{e.nombres}</td>
                      <td className="p-3">{e.apellidos}</td>
                      <td className="p-3">EVALUADOR</td>
                      <td className="p-3">{e.area}</td>
                      <td className="p-3 text-center">
                        <button
                          className="px-3 py-1 mr-2 bg-blue-600 text-white rounded"
                          onClick={() => handleEdit(e)}
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() => handleDelete(e.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* BOTONES */}
          <div className="flex flex-wrap justify-between mt-6">
          
            <button
              className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              onClick={handleCreate}
            >
              Registrar Evaluador
            </button>
          </div>

          {toast && (
            <div
              className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn"
            >
              {toast}
            </div>
          )}


          {/* MODAL */}
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
