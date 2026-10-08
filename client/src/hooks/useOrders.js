import { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be inside OrderProvider');
  return ctx;
}