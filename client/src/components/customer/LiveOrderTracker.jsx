import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { orderApi } from '../../api/orderApi';
import OrderStepper from './OrderStepper';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';

export default function LiveOrderTracker({ orderId, initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const socket = useSocket();

  useEffect(() => {
    if (!orderId) return;
    orderApi.getById(orderId).then(({ data }) => {
      setOrder(data.data);
      if (data.data.tracking_token) socket?.emit('join-order', data.data.tracking_token);
    });
  }, [orderId, socket]);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload) => {
      setOrder((prev) => prev && payload.orderId === prev.id ? { ...prev, status: payload.status } : prev);
    };
    socket.on('order:updated', handler);
    return () => socket.off('order:updated', handler);
  }, [socket]);

  if (!order) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-lg font-bold text-txt-primary mb-6">Progress</h2>
        <OrderStepper status={order.status} createdAt={order.created_at} />
      </div>
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-txt-primary">Receipt</h2>
          <StatusBadge status={order.status} />
        </div>
        <div className="space-y-3 mb-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-txt-secondary">{item.quantity}× {item.name}</span>
              <span className="text-txt-primary font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-txt-secondary"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-txt-secondary"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-border/50">
            <span>Total</span><span className="text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}