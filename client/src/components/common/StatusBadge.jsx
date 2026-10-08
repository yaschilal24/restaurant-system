import { STATUS_LABELS, STATUS_COLORS } from '../../utils/orderStatus';

export default function StatusBadge({ status, className = '' }) {
  const cls = STATUS_COLORS[status] || 'text-txt-muted bg-txt-muted/15 border-txt-muted/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${cls} ${className}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}