import { useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { useToast } from '../../hooks/useToast';

export default function ChapaButton({ orderId, disabled }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data } = await paymentApi.initializeChapa(orderId);
      if (data.data?.checkout_url) window.location.href = data.data.checkout_url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePay} disabled={disabled || loading} className="btn-primary w-full py-3">
      {loading ? 'Processing...' : '💳 Pay with Chapa'}
    </button>
  );
}