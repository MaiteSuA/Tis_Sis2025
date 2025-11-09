// Componente: UsuariosTabs
// Muestra una barra de pestañas (tabs) para alternar entre diferentes secciones o vistas.
// Recibe como props:
// - tabs: arreglo con las pestañas disponibles (cada una con { key, label })
// - active: la pestaña actualmente seleccionada
// - onChange: función que se ejecuta al cambiar de pestaña
export default function UsuariosTabs({ tabs, active, onChange }) {
  return (
    // Contenedor principal de las pestañas
    <div className="tabs-bar">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`tab ${active === t.key ? "tab--active" : ""}`}
        >
          {/* Texto visible de la pestaña */}
          {t.label}
        </button>
      ))}
    </div>
  );
}

