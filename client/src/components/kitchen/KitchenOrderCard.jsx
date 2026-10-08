import OrderTimer from './OrderTimer';
import StatusBadge from '../common/StatusBadge';
import { NEXT_STATUS } from '../../utils/orderStatus';
import KitchenOrderItem from './KitchenOrderItem';

const BUTTON_STYLES = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  warning: 'bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30',
  success: 'bg-success/20 text-success border border-success/30 hover:bg-success/30',
};

export default function KitchenOrderCard({ order, onStatusChange }) {
  const action = NEXT_STATUS[order.status];
  const isReady = order.status === 'ready';

  return (
    <div className={`card p-4 ${isReady ? 'border-success/25' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-txt-primary">#{order.order_number?.slice(-6)}</span>
          <span className="text-[10px] text-txt-muted uppercase tracking-wider">
            {order.order_type?.replace('_', ' ')}
            {order.table_number && ` • ${order.table_number}`}
          </span>
        </div>
        <OrderTimer startedAt={order.created_at} className={`text-xs font-mono font-bold ${isReady ? 'text-success' : 'text-warning'}`} />
      </div>
      <StatusBadge status={order.status} className="mb-3" />
      <div className="space-y-1.5 mb-4">
        {order.items?.map((item, i) => <KitchenOrderItem key={i} item={item} />)}
      </div>
      {order.customer_name && (
        <p className="text-[11px] text-txt-muted mb-3">👤 {order.customer_name}{order.customer_phone && ` • ${order.customer_phone}`}</p>
      )}
      {order.notes && <p className="text-[11px] text-warning/80 mb-3 italic">📝 {order.notes}</p>}
      {action && (
        <button
          onClick={() => onStatusChange(order.id, action.next)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${BUTTON_STYLES[action.variant]}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}