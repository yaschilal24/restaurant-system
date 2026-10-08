import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ICONS = {
  menu: '🍽️', orders: '📋', kitchen: '👨‍🍳', dashboard: '📊',
  tables: '🪑', users: '👥', payments: '💳', profile: '👤', analytics: '📈', settings: '⚙️',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav = user?.role === 'admin' ? [
    { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
    { to: '/admin/orders', icon: 'orders', label: 'Orders' },
    { to: '/admin/menu', icon: 'menu', label: 'Menu' },
    { to: '/admin/tables', icon: 'tables', label: 'Tables' },
    { to: '/admin/users', icon: 'users', label: 'Users' },
    { to: '/admin/payments', icon: 'payments', label: 'Payments' },
  ] : user?.role === 'staff' ? [
    { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
    { to: '/staff/orders', icon: 'orders', label: 'Orders' },
    { to: '/staff', icon: 'dashboard', label: 'Dashboard' },
  ] : [
    { to: '/menu', icon: 'menu', label: 'Menu' },
    { to: '/my-orders', icon: 'orders', label: 'Orders' },
    { to: '/profile', icon: 'profile', label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[72px] bg-bg-secondary border-r border-border items-center py-4 shrink-0">
      <button
        onClick={() => navigate('/')}
        className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg mb-6 shadow-glow"
      >
        R
      </button>
      <nav className="flex flex-col items-center gap-1 flex-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all
               ${isActive ? 'bg-primary/15 border border-primary/25' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`
            }
          >
            {ICONS[item.icon]}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        title="Logout"
        className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-bold text-txt-secondary hover:text-danger hover:border-danger/30 transition-colors"
      >
        {user?.name?.[0]?.toUpperCase() || '?'}
      </button>
    </aside>
  );
}