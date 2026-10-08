import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuApi } from '../../api/menuApi';
import { tableApi } from '../../api/tableApi';
import MenuGrid from '../../components/customer/MenuGrid';
import CategoryTabs from '../../components/customer/CategoryTabs';
import SearchBar from '../../components/customer/SearchBar';
import CartDrawer from '../../components/customer/CartDrawer';
import { useCart } from '../../hooks/useCart';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';

export default function PublicMenu() {
  const { token } = useParams();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (token) {
      localStorage.setItem('table_token', token);
      tableApi.getByToken(token).then(({ data }) => setTable(data.data)).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    Promise.all([menuApi.getCategories(), menuApi.getItems({ available: true })])
      .then(([c, i]) => {
        setCategories(c.data.data);
        setItems(i.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (activeCategory) list = list.filter((i) => i.category_id === activeCategory);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
    }
    return list;
  }, [items, activeCategory, debouncedSearch]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">R</div>
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/my-orders" className="text-xs text-txt-muted hover:text-txt-primary">My Orders</Link>
              ) : (
                <Link to="/login" className="btn-ghost text-xs">Sign in</Link>
              )}
              <button onClick={() => setCartOpen(true)} className="relative lg:hidden w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
                🛒
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {table ? `Table ${table.table_number} • Dine In` : 'Browse Menu'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-txt-primary tracking-tight">
              Menu<span className="text-primary">.</span>
            </h1>
            {table && (
              <p className="text-sm text-txt-secondary mt-2">
                You're ordering from <span className="text-primary font-semibold">Table {table.table_number}</span>
              </p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>

          <MenuGrid items={filtered} loading={loading} />
        </div>
      </div>

      {/* Desktop cart */}
      <div className="hidden lg:block w-[380px] border-l border-border bg-bg-secondary shrink-0">
        <CartDrawer />
      </div>

      {/* Mobile cart overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-bg-secondary border-l border-border">
            <CartDrawer onClose={() => setCartOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}