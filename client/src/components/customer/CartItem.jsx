import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className="flex gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
        <img
          src={item.image_url || `https://source.unsplash.com/100x100/?food,${encodeURIComponent(item.name)}`}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://source.unsplash.com/100x100/?food'; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-txt-primary truncate">{item.name}</h4>
        <p className="text-xs text-primary font-bold mt-0.5">{formatCurrency(item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-bg-elevated border border-border text-xs">−</button>
          <span className="text-sm w-5 text-center">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-bg-elevated border border-border text-xs">+</button>
          <button onClick={() => removeItem(item.menu_item_id)} className="ml-auto text-[10px] text-txt-muted hover:text-danger">Remove</button>
        </div>
      </div>
    </div>
  );
}