import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartDrawer({ onClose }) {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart();
  const navigate = useNavigate();

  const checkout = () => {
    onClose?.();
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-lg font-bold text-txt-primary">Your Order</h2>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/5 text-txt-muted">✕</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <span className="text-4xl mb-3 opacity-40">🛒</span>
            <p className="text-txt-muted text-sm">Your cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.menu_item_id} className="flex gap-3 py-3 border-b border-border/50 last:border-0">
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
                  <button onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-bg-elevated border border-border text-txt-secondary text-xs hover:text-txt-primary">−</button>
                  <span className="text-sm text-txt-primary font-medium w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-bg-elevated border border-border text-txt-secondary text-xs hover:text-txt-primary">+</button>
                  <button onClick={() => removeItem(item.menu_item_id)} className="ml-auto text-[10px] text-txt-muted hover:text-danger">Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-txt-secondary"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-txt-secondary"><span>Tax (8.5%)</span><span>{formatCurrency(tax)}</span></div>
          <div className="flex justify-between text-base font-bold text-txt-primary pt-2 border-t border-border/50">
            <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
          </div>
          <button onClick={checkout} className="btn-primary w-full mt-3">Proceed to Checkout →</button>
        </div>
      )}
    </div>
  );
}