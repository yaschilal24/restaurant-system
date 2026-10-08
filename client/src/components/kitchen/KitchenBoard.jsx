import KitchenColumn from './KitchenColumn';

const COLUMNS = [
  { key: 'pending', label: 'Inbound', color: 'text-warning' },
  { key: 'confirmed', label: 'Confirmed', color: 'text-primary' },
  { key: 'preparing', label: 'Firing', color: 'text-primary' },
  { key: 'ready', label: 'Expedite', color: 'text-success' },
];

export default function KitchenBoard({ orders = [], onStatusChange }) {
  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[900px] lg:min-w-0 h-full">
        {COLUMNS.map((col) => (
          <KitchenColumn
            key={col.key}
            column={col}
            orders={orders.filter((o) => o.status === col.key)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}