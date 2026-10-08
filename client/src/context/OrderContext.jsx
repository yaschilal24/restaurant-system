import { createContext, useState, useCallback } from 'react';
import { orderApi } from '../api/orderApi';

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await orderApi.getById(id);
      setCurrentOrder(data.data);
      return data.data;
    } finally { setLoading(false); }
  }, []);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await orderApi.getMyOrders();
      setOrders(data.data);
      return data.data;
    } finally { setLoading(false); }
  }, []);

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder, orders, setOrders, loading, fetchOrder, fetchMyOrders }}>
      {children}
    </OrderContext.Provider>
  );
}