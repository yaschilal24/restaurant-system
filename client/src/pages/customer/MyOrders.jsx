import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/layout/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    orderApi.getMyOrders()
      .then(({ data }) => setOrders(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (filter === 'active') return !['completed', 'cancelled'].includes(o.status);
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>My Orders<span className="text-primary">.</span></>} />

      <div className="flex gap-2 mb-6">
        {['all', 'active', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all
              ${filter === f ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📋" title="No orders yet" description="Your order history will appear here."
          action={<Link to="/menu" className="btn-primary">Browse Menu</Link>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link key={order.id} to={`/orders/${order.tracking_token || order.id}`}
              className="card p-5 flex items-center justify-between hover:border-primary/30 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-txt-primary">#{order.order_number}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-txt-muted capitalize">
                  {order.order_type.replace('_', ' ')}
                  {order.table_number && ` • ${order.table_number}`}
                  {' • '}{timeAgo(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatCurrency(order.total)}</p>
                <p className="text-[10px] text-txt-muted uppercase tracking-wider">{order.items?.length || 0} items</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}