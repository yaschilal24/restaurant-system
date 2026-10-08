import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../api/analyticsApi';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import TopItems from '../../components/admin/TopItems';
import RecentTransactions from '../../components/admin/RecentTransactions';
import PageHeader from '../../components/layout/PageHeader';
import Loader from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    setLoading(true);
    analyticsApi.getDashboard(period)
      .then(({ data }) => setData(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader kicker="System Overview • Live" title={<>Analytics<span className="text-primary">.</span></>} />

      <div className="flex gap-2 mb-6">
        {[{ k: 'today', l: 'Today' }, { k: 'week', l: '7 Days' }, { k: 'month', l: '30 Days' }].map((p) => (
          <button key={p.k} onClick={() => setPeriod(p.k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${period === p.k ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border hover:text-txt-primary'}`}>
            {p.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Gross Revenue" value={formatCurrency(data?.summary?.gross_revenue)} accent="text-primary" />
        <StatCard title="Total Orders" value={data?.summary?.total_orders || 0} />
        <StatCard title="Avg Ticket" value={formatCurrency(data?.summary?.avg_ticket)} />
        <StatCard title="Top Items" value={data?.topItems?.length || 0} accent="text-success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-bold text-txt-primary mb-4">Revenue Overview</h2>
          <RevenueChart data={data?.dailySales || []} />
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-bold text-txt-primary mb-4">Top Items</h2>
          <TopItems items={data?.topItems || []} />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-txt-primary">Recent Transactions</h2>
          <Link to="/admin/orders" className="text-xs text-primary hover:opacity-80">View All →</Link>
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
}