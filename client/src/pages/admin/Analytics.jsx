import { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/analyticsApi';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import SalesChart from '../../components/admin/SalesChart';
import OrderTypeChart from '../../components/admin/OrderTypeChart';
import TopItems from '../../components/admin/TopItems';
import PageHeader from '../../components/layout/PageHeader';
import Loader from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    setLoading(true);
    analyticsApi.getDashboard(period).then(({ data }) => setData(data.data)).catch(console.error).finally(() => setLoading(false));
  }, [period]);

  const exportCSV = () => {
    if (!data) return;
    const rows = [['Date', 'Revenue', 'Orders'], ...data.dailySales.map((d) => [d.date, d.revenue, d.orders])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `analytics-${period}.csv`; a.click();
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Analytics<span className="text-primary">.</span></>}
        actions={<Button variant="secondary" onClick={exportCSV}>⬇ Export CSV</Button>} />

      <div className="flex gap-2 mb-6">
        {[{ k: 'today', l: 'Today' }, { k: 'week', l: '7 Days' }, { k: 'month', l: '30 Days' }].map((p) => (
          <button key={p.k} onClick={() => setPeriod(p.k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${period === p.k ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
            {p.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Revenue" value={formatCurrency(data?.summary?.gross_revenue)} accent="text-primary" />
        <StatCard title="Orders" value={data?.summary?.total_orders || 0} />
        <StatCard title="Avg Order" value={formatCurrency(data?.summary?.avg_ticket)} />
        <StatCard title="Top Items" value={data?.topItems?.length || 0} accent="text-success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-txt-primary mb-4">Revenue Per Day</h3>
          <RevenueChart data={data?.dailySales || []} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-txt-primary mb-4">Orders Per Day</h3>
          <SalesChart data={data?.dailySales || []} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-txt-primary mb-4">Order Types</h3>
          <OrderTypeChart data={data?.byType || []} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-txt-primary mb-4">Top 10 Items</h3>
          <TopItems items={data?.topItems || []} />
        </div>
      </div>
    </div>
  );
}