import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

export const CartContext = createContext(null);

const initial = {
  items: (() => { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } })(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const found = state.items.find((i) => i.menu_item_id === action.payload.menu_item_id);
      if (found) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menu_item_id === action.payload.menu_item_id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.menu_item_id !== action.payload) };
    case 'SET_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.menu_item_id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menu_item_id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(state.items)); }, [state.items]);

 // client/src/context/CartContext.jsx new add this values
const addItem = useCallback((item) => {
  // Normalize: menu items from the API have `id`, but the order API needs `menu_item_id`
  const normalized = {
    menu_item_id: item.menu_item_id ?? item.id,   // ← handles both
    name: item.name,
    price: Number(item.price),
    image_url: item.image_url,
  };
  if (!normalized.menu_item_id) {
    console.error('❌ Missing menu_item_id for:', item);
    alert('Cannot add item: missing ID. Refresh and try again.');   // ← visible
    return;
  }
  dispatch({ type: 'ADD', payload: normalized });
}, []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'SET_QTY', payload: { id, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const tax = Number((subtotal * 0.085).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
    return { subtotal, tax, total, itemCount };
  }, [state.items]);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}