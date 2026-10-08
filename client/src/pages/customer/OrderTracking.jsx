import { useParams } from 'react-router-dom';
import LiveOrderTracker from '../../components/customer/LiveOrderTracker';
import PageHeader from '../../components/layout/PageHeader';
import { orderApi } from '../../api/orderApi';
import { useEffect, useState } from 'react';
import Loader from '../../components/common/LoadingSpinner';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try { await orderApi.updateStatus(order.id, 'cancelled'); }
    catch (err) { alert(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;
  if (!order) return <div className="p-8 text-center text-txt-muted">Order not found.</div>;

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        kicker="Live Order"
        title={<>Order #{order.order_number}</>}
        description={`${order.order_type.replace('_', ' ')}${order.table_number ? ` • Table ${order.table_number}` : ''}`}
      />
      <LiveOrderTracker orderId={order.id} initialOrder={order} />
      {canCancel && (
        <button onClick={handleCancel} className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-danger border border-danger/30 hover:bg-danger/10 transition-colors">
          Cancel Order
        </button>
      )}
    </div>
  );
}