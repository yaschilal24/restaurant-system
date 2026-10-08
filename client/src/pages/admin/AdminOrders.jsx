import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/layout/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (filter !== 'all') params.status = filter;
    orderApi.list(params)
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.order_number?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q) || o.customer_phone?.includes(q);
  });

  const columns = [
    { key: 'order_number', label: 'Order', render: (o) => <span className="font-medium text-txt-primary">#{o.order_number?.slice(-6)}</span> },
    { key: 'order_type', label: 'Type', render: (o) => <span className="text-txt-secondary capitalize">{o.order_type.replace('_', ' ')}{o.table_number && <span className="text-txt-muted"> • {o.table_number}</span>}</span> },
    { key: 'customer_name', label: 'Customer', render: (o) => <span className="text-txt-secondary">{o.customer_name || 'Guest'}</span> },
    { key: 'status', label: 'Status', render: (o) => <StatusBadge status={o.status} /> },
    { key: 'payment_status', label: 'Payment', render: (o) => <StatusBadge status={o.payment_status} /> },
    { key: 'created_at', label: 'Created', render: (o) => <span className="text-txt-muted text-xs">{formatDate(o.created_at)}</span> },
    { key: 'total', label: 'Total', align: 'right', render: (o) => <span className="font-semibold text-txt-primary">{formatCurrency(o.total)}</span> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Orders<span className="text-primary">.</span></>} />

      <div className="space-y-4 mb-6">
        <input type="text" placeholder="🔍  Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base max-w-md" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all
                ${filter === f ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No orders found." />
    </div>
  );
}