import logo from "../assets/logo-ohsansi.png";

export default function AdminLayout({ children }) {
  const items = ["Inicio", "Dashboard", "Usuarios", "Log"];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* HEADER fijo arriba (encima de los rieles) */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo + nombre (mantengo 224x224 como pediste) */}
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden shrink-0">
              <img
                src={logo}
                alt="logo-ohsansi"
                className="object-contain"
                style={{
                  width: "224px",
                  height: "224px",
                  maxWidth: "224px",
                  maxHeight: "224px",
                }}
              />
            </div>
            <span className="font-semibold text-gray-800 text-lg">OhSanSi</span>
          </div>

          {/* NAV - Menú horizontal en una sola “píldora” */}
          <div className="flex items-center gap-4">
            <div
              aria-label="Secciones"
              className="rounded-full border border-gray-300 bg-white px-2 py-1 shadow-sm inline-flex items-center gap-1"
            >
              {items.map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 ${
                    t === "Dashboard" ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-0">
        {children}
      </main>

      {/* ✅ SOLO RIEL DERECHO (negro). Izquierdo eliminado */}
      <div
        aria-hidden
        className="fixed right-0 inset-y-0 w-4 bg-black z-10 pointer-events-none"
      />
    </div>
  );
}
