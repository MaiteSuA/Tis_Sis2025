export default function StatsStrip({ totals }) {
const {
    totalInscritos = 0,
    clasificados = 0,
  } = totals;

  const Item = ({ label, value }) => (
    <div className="flex-1 card px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs px-3 py-1 rounded-md bg-gray-100 border">{value}</span>
    </div>
  );
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Item label="Total inscritos:" value={totalInscritos} />
      <Item label="Clasificados:" value={clasificados} />
    </div>
  );
}
