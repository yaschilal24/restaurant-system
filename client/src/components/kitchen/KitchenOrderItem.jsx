export default function KitchenOrderItem({ item }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-primary font-bold text-xs mt-0.5">{item.quantity}x</span>
      <span className="text-txt-secondary">{item.name}</span>
    </div>
  );
}