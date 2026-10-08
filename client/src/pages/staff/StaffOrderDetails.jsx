import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { useToast } from '../../hooks/useToast';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { NEXT_STATUS } from '../../utils/orderStatus';

export default function StaffOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = () => {
    orderApi.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetch, [id]);

  const update = async (status) => {
    try {
      const { data } = await orderApi.updateStatus(order.id, status);
      setOrder(data.data);
      toast.success(`Status: ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;
  if (!order) return <div className="p-8 text-center">Not found</div>;

  const action = NEXT_STATUS[order.status];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title={<>Order #{order.order_number}</>}
        description={`${order.order_type.replace('_', ' ')}${order.table_number ? ` • Table ${order.table_number}` : ''}`}
        actions={<StatusBadge status={order.status} />}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">Customer</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-txt-muted">Name:</span> <span className="text-txt-primary">{order.customer_name || 'Guest'}</span></p>
            {order.customer_phone && <p><span className="text-txt-muted">Phone:</span> <span className="text-txt-primary">{order.customer_phone}</span></p>}
            {order.delivery_address && <p><span className="text-txt-muted">Address:</span> <span className="text-txt-primary">{order.delivery_address}</span></p>}
            {order.notes && <p className="text-warning italic">📝 {order.notes}</p>}
          </div>

          {action && (
            <Button variant="primary" className="w-full mt-6" onClick={() => update(action.next)}>
              {action.label}
            </Button>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">Items</h2>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-txt-secondary">{item.quantity}× {item.name}</span>
                <span className="text-txt-primary">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-txt-muted">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-txt-muted">Tax</span><span>{formatCurrency(order.tax)}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">{formatCurrency(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}