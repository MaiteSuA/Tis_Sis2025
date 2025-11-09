export default function UsuariosTabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-bar">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`tab ${active === t.key ? "tab--active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

