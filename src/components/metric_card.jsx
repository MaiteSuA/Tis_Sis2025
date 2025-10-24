const MetricCard = ({ label, value, showDivider = false }) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-2 ${
        showDivider ? "border-l border-slate-300" : ""
      }`}
    >
      {/* Etiqueta */}
      <span className="text-sm sm:text-base text-black font-medium">
        {label}
      </span>

      {/* “Chip” numérico */}
      <span className="inline-flex min-w-22 justify-center rounded-md border border-slate-400 bg-white px-4 py-1 text-sm font-medium text-slate-700 shadow-sm">
        <span className="font-mono tracking-tight">{value}</span>
      </span>
    </div>
  );
};

export default MetricCard;
