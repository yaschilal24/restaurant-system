import { useState, useEffect, use } from 'react';
import { orderApi } from '../../api/orderApi';
import { useSocket } from '../../hooks/useSocket';
import { useToast } from '../../hooks/useToast';
import KitchenHeader from '../../components/kitchen/KitchenHeader';
import KitchenBoard from '../../components/kitchen/KitchenBoard';
import NewOrderAlert from '../../components/kitchen/NewOrderAlert';
import Loader from '../../components/common/LoadingSpinner';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const toast = useToast();
// use this console do
console.get( useEffect);
  useEffect(() => {
    orderApi.list({ limit: 100 })
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNew = (order) => setOrders((prev) => [order, ...prev]);
    const handleUpdate = ({ orderId, status }) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    };
    socket.on('order:new', handleNew);
    socket.on('order:updated', handleUpdate);
    return () => {
      socket.off('order:new', handleNew);
      socket.off('order:updated', handleUpdate);
    };
  }, [socket]);

 const [updatingIds, setUpdatingIds] = useState(new Set());

const handleStatusChange = async (orderId, status) => {
  // Prevent double-click
  if (updatingIds.has(orderId)) {
    console.log('⏳ Already updating order', orderId);
    return;
  }

  setUpdatingIds((prev) => new Set(prev).add(orderId));
  console.log('🔄 PATCH /orders/' + orderId, { status });

  try {
    const { data } = await orderApi.updateStatus(orderId, status);
    console.log('✅ Updated:', data);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    toast.success(`Order → ${status}`);
  } catch (err) {
    console.error('❌ Update failed:', err.response?.data || err.message);
    toast.error(err.response?.data?.message || 'Failed to update');
  } finally {
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  }
};

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  const active = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  const itemCount = active.reduce((sum, o) => sum + (o.items?.length || 0), 0);

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      <NewOrderAlert />
      <KitchenHeader activeCount={active.length} itemCount={itemCount} />
      <KitchenBoard orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
}