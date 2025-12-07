import React, { useEffect, useState } from "react";
import Header from "../components/header";
import EvaluadorForm from "../components/EvaluadorForm.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useNavigate } from "react-router-dom";

// Servicios
import {
  createEvaluadorCompleto,
  getEvaluadores,
  updateEvaluadorCompleto,
  deleteEvaluadorCompleto,
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

  const [toast, setToast] = useState("");

  const [user, setUser] = useState(null);

  const [filterEstado, setFilterEstado] = useState("todos");

  const navigate = useNavigate();

  //get NOTA MINIMA
  const [notaMinima, setNotaMinima] = useState(null);

  // ====================== TOAST ======================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  //Get Nota minima
 useEffect(() => {
  const fetchNotaMinima = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN ENVIADO:", token); // para verificar

      const res = await fetch(`${import.meta.env.VITE_API_URL}/fases/clasificacion`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log("RESPUESTA DEL BACKEND:", data);

      
      setNotaMinima(Number(data.nota_minima));
      
    } catch (err) {
      console.error("Error al obtener nota mínima:", err);
    }
  };

  fetchNotaMinima();
}, []);


  // ====================== LOGIN ======================
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token en frontend:", token);
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/responsables/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener el usuario");

      const data = await res.json();
      
      if (data.ok) {
        console.log(data);

        setUser(data.data); // Guarda directamente { nombres, apellidos, correo, area, estado, rol }
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  fetchUser();
}, []);


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
      const evaluador = evaluadores.find((e) => e.id === id);

      // 1 Eliminar evaluador
      await deleteEvaluadorCompleto(evaluador.id);

      setEvaluadores(prev => prev.filter(e => e.id !== id));
      showToast("Evaluador eliminado ✔");
    } catch (err) {
      alert("No se pudo eliminar: " + err.message);
    }
  };

  // ====================== GUARDAR ======================
const handleSave = async (formData) => {
  try {
    const payload = {
      nombre_evaluado: formData.nombres,
      apellidos_evaluador: formData.apellidos,
      correo: formData.correo,
      telefono: formData.telefono,
      id_area: Number(formData.areaId),
    };

    if (mode === "create") {
      // 1️⃣ Crear evaluador + usuario en una sola llamada
      const saved = await createEvaluadorCompleto(payload);

      // 2️⃣ Actualizar el estado del front
      setEvaluadores(prev => [
        ...prev,
        {
          ...saved,
          area: areas.find(a => a.id === Number(formData.areaId))?.nombre
        }
      ]);

      showToast("Evaluador registrado ✔");
    } else {
      // 1️⃣ Actualizar evaluador + usuario
      const saved = await updateEvaluadorCompleto(selected.id, payload);
      

      // 2️⃣ Actualizar el estado del front
      setEvaluadores(prev =>
        prev.map(e => e.id === selected.id
          ? { ...saved, area: areas.find(a => a.id === Number(formData.areaId))?.nombre }
          : e
        )
      );

      showToast("Evaluador actualizado ✔");
    }

    // 3️⃣ Cerrar modal
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

  // ====================== CARGAR COMPETIDORES ======================
  useEffect(() => {
    if (notaMinima === null) return; // espera a que la nota mínima esté cargada
    const fetchCompetidores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/evaluaciones`);
        const result = await response.json();
        if (!response.ok) throw new Error("Error al obtener los datos");
        
        if (result.ok) {
          const normalizados = result.data.map(c => {
            const rawNota = c.nota;
            const nota = rawNota !== null && rawNota !== undefined && rawNota !== "" 
            ? Number(rawNota) 
            : null;

            let estado = "Pendiente"; // por defecto

            if (nota !== null) {
              if (nota >= notaMinima) estado = "Clasificado";
              else estado = "No Clasificado";
            }

            return { ...c, estado };
          });

          setCompetidores(normalizados);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetidores();
  }, [notaMinima]);

  

  // ====================== EXPORTAR EXCEL ======================
  const exportExcel = () => {
    if (!competidoresFiltrados.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const data = competidoresFiltrados.map((c) => ({
      ID_Inscrito: c.id_inscrito,
      Competidor: c.competidor,
      Nota: c.nota,
      Observación: c.observacion,
      Estado: c.estado,
      Fase: 2,

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

  
  // ====================== CREAR ======================
  const handleCreate = () => {
    setSelected(null);
    setMode("create");
    setShowForm(true);
  };

  const competidoresFiltrados = competidores.filter((c) => {
  switch (filterEstado) {
    case "clasificados":
      return c.estado === "Clasificado";
    case "noClasificados":
      return c.estado === "No Clasificado";
    case "pendientes":
      return c.estado === "Pendiente";
    default:
      return true; }
});

//Mostrar evluadores por Area unicamente
const evaluadoresFiltrados = evaluadores.filter(e => {
  if (!user) return false; // Evita mostrar algo antes de cargar usuario
  return e.area === user.area;
});

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Header />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="!bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">RESPONSABLE DE ÁREA</h2>
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                  <p className="text-gray-700">
                    Nombre: {user ? `${user.nombres} ${user.apellidos}` : "Cargando..."}
                  </p>
                  <p className="text-gray-700">
                    Correo: {user ? user.correo : "Cargando..."}
                  </p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                Área: {user ? user.area : "Cargando..."} 
              </h2>
              <p className="text-gray-500">
                Estado: {user ? user.estado : "Cargando..."}
                </p>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="!bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Resumen</h3>
              <ul className="text-gray-700">
                <li>Competidores Totales: {competidores.length}</li>
                <li>
                  Clasificados:{" "}
                  {competidores.filter((c) => c.estado === "Clasificado").length}
                </li>
                <li>
                  No Clasificados:{" "}
                  {competidores.filter((c) => c.estado === "No Clasificado").length}
                </li>
                <li>
                  Pendientes:{" "}
                  {competidores.filter((c) => c.estado === "Pendiente").length}
                </li>
                <li>
                  Descalificado:{" "}
                  {competidores.filter((c) => c.estado === "Descalificado").length}
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

              <button className="mt-3 !bg-gray-800 text-white px-4 py-2 rounded-lg hover:!bg-gray-700">
                Concluir Fase
              </button>
            </div>
          </div>

          
          {/* EVALUADORES */}
          <h3 className="text-lg font-bold mt-10 mb-3">
            Evaluadores Registrados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse shadow rounded-lg">
              <thead className="!bg-gray-300 text-gray-800">
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
                  evaluadoresFiltrados.map((e) => (
                    <tr key={e.id} className="border-t hover:!bg-gray-200">
                      <td className="p-3">{e.id}</td>
                      <td className="p-3">{e.nombres}</td>
                      <td className="p-3">{e.apellidos}</td>
                      <td className="p-3">EVALUADOR</td>
                      <td className="p-3">{e.area}</td>
                      <td className="p-3 text-center">
                        <button
                          className="px-3 py-1 mr-2 !bg-gray-600 text-white rounded hover:!bg-gray-500"
                          onClick={() => handleEdit(e)}
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-gray-800 text-white rounded hover:!bg-gray-700"
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
          <div className="flex flex-wrap justify-end mt-6">
          
            <button
              className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:!bg-gray-700"
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

          {/* Tabla Clasificatoria */}
          <h3 className="text-lg font-bold mb-3 ">Resultados Clasificatoria</h3>
          <div className="mb-4 flex gap-3 items-center">
            <label className="font-semibold">Filtrar:</label>
            <select
              className="border px-3 py-2 rounded-lg"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="clasificados">Clasificados</option>
              <option value="noClasificados">No Clasificados</option>
              <option value="pendientes">Pendientes</option>
            </select>
          </div>

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
                {competidoresFiltrados.map((c, i) => (

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
          <div className="flex flex-wrap justify-end mt-6 mb-10">
            <div className="flex gap-2">
              <button
                onClick={exportExcel}
                className="!bg-gray-800 text-white px-4 py-2 rounded-lg hover:!bg-gray-700"
              >
                Exportar Excel
              </button>

                <button 
                  onClick={() => navigate("/ResponsableDocumentosClasificados")} 
                  className="!bg-gray-700 text-white px-4 py-2 rounded-lg hover:!bg-gray-600" > 
                  Autorizar Publicación Clasificados
                </button>

                <button 
                  onClick={() => navigate("/ResponsableMedallero")} 
                  className="!bg-gray-700 text-white px-4 py-2 rounded-lg hover:!bg-gray-600" > 
                  Autorizar Publicación Medallero
                </button>

            </div>
          </div>


          {/* MODAL */}
          {showForm && (
            <EvaluadorForm
              key={mode + (selected?.id ?? "nuevo")}
              mode={mode}
              title="Registro de Evaluador"
              areas={areas.filter(a => a.nombre === user?.area)}
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
