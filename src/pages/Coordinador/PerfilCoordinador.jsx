import {useState } from "react";
import TopNav from "../../components/coordinador/TopNav";
import Sidebar from "../../components/coordinador/Sidebar";

/**
 * Perfil del Coordinador (solo front)
 * - Edita datos básicos y preferencias 
 * - Guarda temporalmente en localStorage
 * - Sin llamadas al backend
 */
export default function PerfilCoordinador() {
  // estado base (carga de localStorage si existe)
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("perfilCoordinador");
    return (
      JSON.parse(saved || "null") || {
        nombre: "Coordinador Demo",
        email: "coordinador@ohsansi.edu",
        telefono: "",
        documento: "",
        area: "Matemática",
        departamento: "Cochabamba",
        avatarUrl: "",
        prefs: {
          temaOscuro: false,
          notifEmail: true,
          notifWhatsApp: false,
        },
      }
    );
  });

  const [msg, setMsg] = useState("");

  // util
  const AREAS = [
    "Matemática",
    "Física",
    "Química",
    "Biología",
    "Informática",
    "Robótica",
  ];
  const DEPARTAMENTOS = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
  ];

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updatePref(k, v) {
    setForm((f) => ({ ...f, prefs: { ...f.prefs, [k]: v } }));
  }

  function handleGuardar() {
    localStorage.setItem("perfilCoordinador", JSON.stringify(form));
    setMsg("✅ Perfil guardado localmente.");
    setTimeout(() => setMsg(""), 3000);
  }

  function handleCancelar() {
    const saved = localStorage.getItem("perfilCoordinador");
    setForm(saved ? JSON.parse(saved) : form); // restaura a lo último guardado
    setMsg("↩️ Cambios descartados.");
    setTimeout(() => setMsg(""), 2000);
  }

  function handleFakePasswordChange(e) {
    e.preventDefault();
    setMsg("🔒 (Demo) Contraseña actualizada localmente.");
    setTimeout(() => setMsg(""), 3000);
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

            {/* Datos básicos */}
            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Datos personales</p>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    {form.avatarUrl ? (
                      <img
                        src={form.avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        sin foto
                      </div>
                    )}
                  </div>
                  <input
                    className="input flex-1"
                    placeholder="URL de foto de perfil"
                    value={form.avatarUrl}
                    onChange={(e) => update("avatarUrl", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Nombre</label>
                  <input
                    className="input"
                    value={form.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Teléfono</label>
                  <input
                    className="input"
                    value={form.telefono}
                    onChange={(e) => update("telefono", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Documento (CI)</label>
                  <input
                    className="input"
                    value={form.documento}
                    onChange={(e) => update("documento", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Área</label>
                  <select
                    className="input"
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                  >
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Departamento</label>
                  <select
                    className="input"
                    value={form.departamento}
                    onChange={(e) => update("departamento", e.target.value)}
                  >
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
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

            {/* Preferencias */}
            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Preferencias</p>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.prefs.temaOscuro}
                    onChange={(e) => updatePref("temaOscuro", e.target.checked)}
                  />
                  <span>Tema oscuro</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.prefs.notifEmail}
                    onChange={(e) => updatePref("notifEmail", e.target.checked)}
                  />
                  <span>Notificaciones por email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.prefs.notifWhatsApp}
                    onChange={(e) =>
                      updatePref("notifWhatsApp", e.target.checked)
                    }
                  />
                  <span>Notificaciones por WhatsApp</span>
                </label>
              </div>
            </section>

            {/* Contraseña (demo front) */}
            <section className="card">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Seguridad</p>
              </div>
              <form className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleFakePasswordChange}>
                <input className="input" type="password" placeholder="Contraseña actual" required />
                <input className="input" type="password" placeholder="Nueva contraseña" required />
                <input className="input" type="password" placeholder="Repite nueva contraseña" required />
                <div className="md:col-span-3">
                  <button className="btn btn-primary" type="submit">
                    Actualizar contraseña (demo)
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
