import KitchenOrderCard from './KitchenOrderCard';

export default function KitchenColumn({ column, orders, onStatusChange }) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <h2 className={`text-sm font-bold uppercase tracking-wider ${column.color}`}>{column.label}</h2>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-current/10 ${column.color}`}>
          {orders.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {orders.map((order) => (
          <KitchenOrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
        ))}
        {orders.length === 0 && <div className="text-center py-8 text-txt-disabled text-xs">Empty</div>}
      </div>
    </div>
  );
}