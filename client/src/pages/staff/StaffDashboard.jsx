import { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/analyticsApi';
import StatCard from '../../components/admin/StatCard';
import RecentTransactions from '../../components/admin/RecentTransactions';
import PageHeader from '../../components/layout/PageHeader';
import Loader from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';

export default function StaffDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getDashboard('today')
      .then(({ data }) => setData(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader kicker="System Live" title={<>Operations<span className="text-primary">.</span></>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Orders" value={data?.summary?.total_orders || 0} />
        <StatCard title="Revenue" value={formatCurrency(data?.summary?.gross_revenue)} accent="text-primary" />
        <StatCard title="Avg Ticket" value={formatCurrency(data?.summary?.avg_ticket)} />
        <StatCard title="Active Items" value={data?.topItems?.length || 0} accent="text-success" />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-txt-primary mb-4">Recent Orders</h2>
        <RecentTransactions />
      </div>
    </div>
  );
}