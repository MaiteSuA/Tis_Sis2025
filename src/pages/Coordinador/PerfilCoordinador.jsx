import { useEffect, useState } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";
import {
  getPerfilCoordinador,
  updatePerfilCoordinador,
} from "../../services/api";

export default function PerfilCoordinador() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    carnet: "",
  });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Cargar perfil desde el backend al entrar
  useEffect(() => {
    async function load() {
      try {
        const data = await getPerfilCoordinador();
        setForm({
          nombre: data.nombre ?? "",
          apellido: data.apellido ?? "",
          correo: data.correo ?? "",
          telefono: data.telefono ?? "",
          carnet: data.carnet ?? "",
        });
        setOriginal(data);
      } catch (err) {
        console.error(err);
        setMsg(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCancelar() {
    if (!original) return;
    setForm({
      nombre: original.nombre ?? "",
      apellido: original.apellido ?? "",
      correo: original.correo ?? "",
      telefono: original.telefono ?? "",
      carnet: original.carnet ?? "",
    });
    setMsg("↩️ Cambios descartados.");
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleGuardar(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const updated = await updatePerfilCoordinador(form);
      setOriginal(updated);
      setMsg("✅ Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error al guardar los cambios");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  if (loading) {
    return (
      <div className="container-app">
        <TopNav />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="w-full max-w-6xl mx-auto px-4 py-6">
              Cargando perfil...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-4">
            <h1 className="text-lg font-semibold text-gray-700">
              Perfil del Coordinador
            </h1>

            {msg && (
              <div className="card px-4 py-3">
                <p className="text-sm">{msg}</p>
              </div>
            )}

            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Datos personales</p>
              </div>
              <form
                className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={handleGuardar}
              >
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Nombre</label>
                  <input
                    className="input"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Apellidos</label>
                  <input
                    className="input"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    className="input"
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Teléfono</label>
                  <input
                    className="input"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Documento (CI)
                  </label>
                  <input
                    className="input"
                    name="carnet"
                    value={form.carnet}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-3 flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={handleCancelar}
                    disabled={saving}
                  >
                    Descartar cambios
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
 