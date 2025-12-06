// Componente que muestra una barra de pestañas (tabs) de navegación o filtrado
export default function UsuariosTabs({ tabs, active, onChange }) {
  return (
    // Contenedor principal de la barra de pestañas
    <div className="tabs-bar">
      {/* Recorre el arreglo 'tabs' y dibuja un botón por cada pestaña */}
      {tabs.map(t => (
        <button
          key={t.key} // clave única para React (identificador de la pestaña)
          onClick={() => onChange(t.key)} // llama al callback 'onChange' con la clave de la pestaña seleccionada
          // Clase CSS dinámica: si la pestaña está activa, aplica el estilo "tab--active"
          className={`tab ${active === t.key ? "tab--active" : ""}`}
        >
          {/* Texto o etiqueta visible de la pestaña */}
          {t.label}
        </button>
      ))}
    </div>
  );
}


