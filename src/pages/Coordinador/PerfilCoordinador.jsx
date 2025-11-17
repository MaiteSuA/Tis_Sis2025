import { useState } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";

/**
 * Perfil del Coordinador (solo front, versión simplificada)
 * - Solo datos básicos: nombre, email, teléfono, CI
 * - Guarda localmente en localStorage
 */
export default function PerfilCoordinador() {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("perfilCoordinador");
    const base = {
      nombre: "Coordinador Demo",
      email: "coordinador@ohsansi.edu",
      telefono: "",
      documento: "",
    };
    if (!saved) return base;
    try {
      const parsed = JSON.parse(saved);
      // si había campos viejos (area, depto, prefs, avatar), los ignoramos
      return { ...base, ...parsed };
    } catch {
      return base;
    }
  });

  const [msg, setMsg] = useState("");

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleGuardar() {
    localStorage.setItem("perfilCoordinador", JSON.stringify(form));
    setMsg("✅ Perfil guardado localmente.");
    setTimeout(() => setMsg(""), 3000);
  }

  function handleCancelar() {
    const saved = localStorage.getItem("perfilCoordinador");
    if (saved) {
      setForm(JSON.parse(saved));
      setMsg("↩️ Cambios descartados.");
      setTimeout(() => setMsg(""), 2000);
    }
  }

  // 🔒 Esta función queda para la sección de seguridad (comentada en JSX)
  /* function handleFakePasswordChange(e) {
    e.preventDefault();
    setMsg("🔒 (Demo) Contraseña actualizada localmente.");
    setTimeout(() => setMsg(""), 3000);
  }  */

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

            {/* Datos básicos */}
            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Datos personales</p>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">
                    Nombre
                  </label>
                  <input
                    className="input"
                    value={form.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Teléfono
                  </label>
                  <input
                    className="input"
                    value={form.telefono}
                    onChange={(e) => update("telefono", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Documento (CI)
                  </label>
                  <input
                    className="input"
                    value={form.documento}
                    onChange={(e) => update("documento", e.target.value)}
                  />
                </div>

                <div className="md:col-span-3 flex items-center gap-3">
                  <button className="btn" onClick={handleCancelar}>
                    Descartar cambios
                  </button>
                  <button className="btn btn-primary" onClick={handleGuardar}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            </section>

            {/* 🔒 Seguridad (comentada, no se muestra en la UI)
            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Seguridad</p>
              </div>
              <form
                className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={handleFakePasswordChange}
              >
                <input
                  className="input"
                  type="password"
                  placeholder="Contraseña actual"
                  required
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Nueva contraseña"
                  required
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Repite nueva contraseña"
                  required
                />
                <div className="md:col-span-3">
                  <button className="btn btn-primary" type="submit">
                    Actualizar contraseña (demo)
                  </button>
                </div>
              </form>
            </section>
            */}
          </div>
        </main>
      </div>
    </div>
  );
}
