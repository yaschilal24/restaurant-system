import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderSummary({ items = [], subtotal, tax, total }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span className="text-txt-secondary">{item.quantity}× {item.name}</span>
          <span className="text-txt-primary font-medium">{formatCurrency(item.price * item.quantity)}</span>
        </div>
      ))}
      <div className="space-y-2 border-t border-border pt-4 mt-4">
        <div className="flex justify-between text-sm text-txt-secondary"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between text-sm text-txt-secondary"><span>Tax (8.5%)</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between text-lg font-bold text-txt-primary pt-3 border-t border-border/50">
          <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}