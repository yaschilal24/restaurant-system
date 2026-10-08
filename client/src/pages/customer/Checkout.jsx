import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { orderApi } from '../../api/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';
import EmptyState from '../../components/common/EmptyState';
import PaymentMethod from '../../components/payment/PaymentMethod';
import PageHeader from '../../components/layout/PageHeader';
import { paymentApi } from '../../api/paymentApi';
export default function Checkout() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

// Read + refresh on every render so it's never stale
const tableToken = typeof window !== 'undefined' ? localStorage.getItem('table_token') : null;

  const [orderType, setOrderType] = useState(tableToken ? 'dine_in' : 'pickup');
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_phone: user?.phone || '',
    delivery_address: '',
    notes: '',
    payment_method: 'cash',
  });
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!items.length) return;

  if (orderType === 'dine_in' && !tableToken) {
    toast.error('Table token missing. Please scan the QR code again.');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      items: items.map((i) => ({
        menu_item_id: Number(i.menu_item_id),
        quantity: Number(i.quantity),
      })),
      order_type: orderType,
      table_token: orderType === 'dine_in' ? (tableToken || null) : null,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      delivery_address: orderType === 'delivery' ? form.delivery_address : null,
      notes: form.notes,
      payment_method: form.payment_method,
    };

    console.log('📤 Order payload:', payload);

    const { data } = await orderApi.create(payload);
    const order = data.data.order;

    // Chapa flow
    if (form.payment_method === 'chapa') {
      try {
        const payRes = await paymentApi.initializeChapa(order.id);
        const url = payRes.data?.data?.checkout_url;
        if (!url) throw new Error('No checkout URL returned');
        window.location.href = url;
        return;
      } catch (chapaErr) {
        console.error('❌ Chapa init failed:', chapaErr.response?.data || chapaErr.message);
        toast.error('Chapa initialization failed');
        return;
      }
    }

    // Cash flow
    clearCart();
    localStorage.removeItem('table_token');
    toast.success('Order placed successfully!');
    navigate(`/orders/${order.tracking_token}`);
  } catch (err) {
    console.error('❌ Order failed:', err.response?.data);
    toast.error(err.response?.data?.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};
  
  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState icon="🛒" title="Your cart is empty" description="Add items from the menu to place an order."
          action={<button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Checkout<span className="text-primary">.</span></>} />
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
  <div className="card p-5">
    <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">Order Type</h2>
    <div className="grid grid-cols-3 gap-3">
      {[
        { key: 'dine_in', label: 'Dine In', emoji: '🍽️', disabled: !tableToken },
        { key: 'pickup', label: 'Pickup', emoji: '🥡', disabled: false },
        { key: 'delivery', label: 'Delivery', emoji: '🚗', disabled: false },
      ].map((opt) => (
        <button
          key={opt.key}
          type="button"
          disabled={opt.disabled}
          onClick={() => !opt.disabled && setOrderType(opt.key)}
          title={opt.disabled ? 'Scan a table QR code first (e.g. /t/TOKEN)' : ''}
          className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all
            ${orderType === opt.key ? 'border-primary bg-primary/10' : 'border-border bg-bg-elevated hover:border-primary/30'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span className="text-xs font-semibold text-txt-primary">{opt.label}</span>
        </button>
      ))}
    </div>

    {!tableToken && (
      <p className="text-xs text-txt-muted mt-3 flex items-center gap-2">
        💡 <span>To enable <strong className="text-primary">Dine In</strong>, scan a table QR code first.</span>
      </p>
    )}
    {tableToken && orderType === 'dine_in' && (
      <p className="text-xs text-success mt-3">
        ✓ Ordering for <strong>your table</strong> — table is auto-detected.
      </p>
    )}
  </div>

  <div className="card p-5">
    <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">
      {orderType === 'delivery' ? 'Delivery Details' : 'Your Details'}
    </h2>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Full Name</label>
        <input
          type="text"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          className="input-base"
          required
        />
      </div>
      <div>
        <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Phone</label>
        <input
          type="tel"
          value={form.customer_phone}
          onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
          className="input-base"
          required
        />
      </div>
      {orderType === 'delivery' && (
        <div className="sm:col-span-2">
          <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Delivery Address</label>
          <textarea
            value={form.delivery_address}
            onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
            className="input-base h-20 resize-none"
            required
          />
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="input-base h-20 resize-none"
          placeholder="Allergies, preferences..."
        />
      </div>
    </div>
  </div>

  <div className="card p-5">
    <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">Payment Method</h2>
    <PaymentMethod value={form.payment_method} onChange={(v) => setForm({ ...form, payment_method: v })} />
  </div>
</div>

        <div className="lg:sticky lg:top-6 h-fit">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.menu_item_id} className="flex justify-between text-sm">
                  <span className="text-txt-secondary">{item.quantity}× {item.name}</span>
                  <span className="text-txt-primary font-medium">{formatCurrency(Number(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm text-txt-secondary"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-txt-secondary"><span>Tax (8.5%)</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between text-lg font-bold text-txt-primary pt-3 border-t border-border/50">
                <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-5">
              {loading ? 'Placing order...' : 'Place Order →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}