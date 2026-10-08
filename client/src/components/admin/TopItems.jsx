import { formatCurrency } from '../../utils/formatCurrency';

export default function TopItems({ items = [] }) {
  if (!items.length) return <p className="text-sm text-txt-muted py-8 text-center">No sales data yet.</p>;
  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-bg-elevated flex items-center justify-center text-[10px] font-bold text-txt-muted">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-txt-primary truncate">{item.name}</p>
            <p className="text-[11px] text-txt-muted">{item.total_quantity} sold</p>
          </div>
          <span className="text-sm font-bold text-primary">{formatCurrency(item.total_revenue)}</span>
        </div>
      ))}
    </div>
  );
}