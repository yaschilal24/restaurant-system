import StatusBadge from '../common/StatusBadge';

export default function PaymentStatus({ status }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-txt-muted">Payment:</span>
      <StatusBadge status={status} />
    </div>
  );
}