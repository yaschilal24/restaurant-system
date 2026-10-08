import { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';

export default function RecentTransactions({ limit = 10 }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.list({ limit })
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <p className="text-center text-txt-muted py-8 text-sm">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-txt-muted border-b border-border">
            <th className="text-left py-3 pr-4 font-semibold">Order</th>
            <th className="text-left py-3 pr-4 font-semibold">Type</th>
            <th className="text-left py-3 pr-4 font-semibold">Customer</th>
            <th className="text-left py-3 pr-4 font-semibold">Status</th>
            <th className="text-left py-3 pr-4 font-semibold">Time</th>
            <th className="text-right py-3 font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border/50 hover:bg-white/[0.02]">
              <td className="py-3 pr-4 text-txt-primary font-medium">#{o.order_number?.slice(-6)}</td>
              <td className="py-3 pr-4 text-txt-secondary capitalize">{o.order_type?.replace('_', ' ')}</td>
              <td className="py-3 pr-4 text-txt-secondary">{o.customer_name || 'Walk-in'}</td>
              <td className="py-3 pr-4"><StatusBadge status={o.status} /></td>
              <td className="py-3 pr-4 text-txt-muted text-xs">{timeAgo(o.created_at)}</td>
              <td className="py-3 text-right text-txt-primary font-semibold">{formatCurrency(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-center text-txt-muted py-8 text-sm">No transactions yet.</p>}
    </div>
  );
}