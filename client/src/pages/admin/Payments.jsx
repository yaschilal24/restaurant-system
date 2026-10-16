// import { useState, useEffect } from 'react';
// import { paymentApi } from '../../api/paymentApi';
// import DataTable from '../../components/admin/DataTable';
// import StatusBadge from '../../components/common/StatusBadge';
// import PageHeader from '../../components/layout/PageHeader';
// import { formatCurrency } from '../../utils/formatCurrency';
// import { formatDate } from '../../utils/formatDate';

// export default function Payments() {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     paymentApi.list()
//       .then(({ data }) => setPayments(data.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const columns = [
//     { key: 'id', label: 'ID', render: (p) => <span className="text-txt-muted text-xs">#{p.id}</span> },
//     { key: 'order_number', label: 'Order', render: (p) => <span className="font-medium text-txt-primary">{p.order_number || '—'}</span> },
//     { key: 'provider', label: 'Provider', render: (p) => <span className="text-txt-secondary capitalize">{p.provider}</span> },
//     { key: 'reference', label: 'Reference', render: (p) => <span className="text-txt-muted text-xs">{p.reference || '—'}</span> },
//     { key: 'amount', label: 'Amount', render: (p) => <span className="font-semibold text-txt-primary">{formatCurrency(p.amount)}</span> },
//     { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
//     { key: 'created_at', label: 'Date', render: (p) => <span className="text-txt-muted text-xs">{formatDate(p.created_at)}</span> },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       <PageHeader title={<>Payments<span className="text-primary">.</span></>} />
//       <DataTable columns={columns} rows={payments} loading={loading} emptyMessage="No payments yet." />
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { paymentApi } from '../../api/paymentApi';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    paymentApi.list()
      .then(({ data }) => setPayments(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post('/payments/sync-pending');
      toast.success(`Synced: ${data.data.updated} paid, ${data.data.failed} failed`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (p) => <span className="text-txt-muted text-xs">#{p.id}</span> },
    { key: 'order_number', label: 'Order', render: (p) => <span className="font-medium text-txt-primary">{p.order_number || '—'}</span> },
    { key: 'provider', label: 'Provider', render: (p) => <span className="text-txt-secondary capitalize">{p.provider}</span> },
    { key: 'reference', label: 'Reference', render: (p) => <span className="text-txt-muted text-xs">{p.reference?.slice(0, 25) || '—'}</span> },
    { key: 'amount', label: 'Amount', render: (p) => <span className="font-semibold text-txt-primary">{formatCurrency(p.amount)}</span> },
    { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'created_at', label: 'Date', render: (p) => <span className="text-txt-muted text-xs">{formatDate(p.created_at)}</span> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title={<>Payments<span className="text-primary">.</span></>}
        actions={
          <Button onClick={handleSync} loading={syncing} variant="secondary">
            🔄 Sync with Chapa
          </Button>
        }
      />
      <DataTable columns={columns} rows={payments} loading={loading} emptyMessage="No payments yet." />
    </div>
  );
}