import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { playNotificationSound } from '../../services/notificationService';

export default function NewOrderAlert() {
  const socket = useSocket();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!socket) return;
    const handler = (order) => {
      playNotificationSound();
      setAlert(order);
      setTimeout(() => setAlert(null), 5000);
    };
    socket.on('order:new', handler);
    return () => socket.off('order:new', handler);
  }, [socket]);

  if (!alert) return null;

  return (
    <div className="fixed top-6 right-6 z-[90] w-80 card-elevated border-primary/40 shadow-glow animate-slide-in p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        New Order
      </div>
      <p className="text-sm font-bold text-txt-primary">#{alert.orderNumber}</p>
      <p className="text-xs text-txt-muted mt-1">
        {alert.orderType?.replace('_', ' ')} • {alert.items?.length || 0} items • ${Number(alert.total || 0).toFixed(2)}
      </p>
    </div>
  );
}