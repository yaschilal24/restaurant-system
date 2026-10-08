import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/layout/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';

const FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed'];

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (filter !== 'all') params.status = filter;
    orderApi.list(params)
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Orders<span className="text-primary">.</span></>} />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all
              ${filter === f ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/staff/orders/${order.id}`}
              className="card p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-bold text-txt-primary">#{order.order_number?.slice(-6)}</p>
                  <p className="text-[11px] text-txt-muted capitalize mt-0.5">
                    {order.order_type.replace('_', ' ')}
                    {order.table_number && ` • ${order.table_number}`}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatCurrency(order.total)}</p>
                <p className="text-[10px] text-txt-muted">{timeAgo(order.created_at)}</p>
              </div>
            </Link>
          ))}
          {orders.length === 0 && <p className="text-center text-txt-muted py-12">No orders.</p>}
        </div>
      )}
    </div>
  );
}