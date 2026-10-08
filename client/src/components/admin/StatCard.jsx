export default function StatCard({ title, value, accent = 'text-txt-primary', change }) {
  return (
    <div className="card p-5">
      <p className="text-[10px] uppercase tracking-wider text-txt-muted mb-2">{title}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${change > 0 ? 'text-success' : 'text-danger'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      )}
    </div>
  );
}