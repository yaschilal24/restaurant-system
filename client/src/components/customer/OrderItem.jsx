import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderItem({ item }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-txt-secondary">{item.quantity}× {item.name}</span>
      <span className="text-txt-primary font-medium">{formatCurrency(item.price * item.quantity)}</span>
    </div>
  );
}