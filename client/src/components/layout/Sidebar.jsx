// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const ICONS = {
//   menu: '🍽️', orders: '📋', kitchen: '👨‍🍳', dashboard: '📊',
//   tables: '🪑', users: '👥', payments: '💳 ', profile: '👤', analytics: '📈', settings: '⚙️',
// };

// export default function Sidebar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const nav = user?.role === 'admin' ? [
//     { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
//     { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
//     { to: '/admin/orders', icon: 'orders', label: 'Orders' },
//     { to: '/admin/menu', icon: 'menu', label: 'Menu' },
//     { to: '/admin/tables', icon: 'tables', label: 'Tables' },
//     { to: '/admin/users', icon: 'users', label: 'Users' },
//     { to: '/admin/payments', icon: 'payments', label: 'Payments' },
//   ] : user?.role === 'staff' ? [
//     { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
//     { to: '/staff/orders', icon: 'orders', label: 'Orders' },
//     { to: '/staff', icon: 'dashboard', label: 'Dashboard' },
//   ] : [
//     { to: '/menu', icon: 'menu', label: 'Menu' },
//     { to: '/my-orders', icon: 'orders', label: 'Orders' },
//     { to: '/profile', icon: 'profile', label: 'Profile' },
//   ];

//   return (
//     <aside className="hidden md:flex flex-col w-[72px] bg-bg-secondary border-r border-border items-center py-4 shrink-0">
//       <button
//         onClick={() => navigate('/')}
//         className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg mb-6 shadow-glow"
//       >
//         R
//       </button>
//       <nav className="flex flex-col items-center gap-1 flex-1">
//         {nav.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             title={item.label}
//             className={({ isActive }) =>
//               `w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all
//                ${isActive ? 'bg-primary/15 border border-primary/25' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`
//             }
//           >
//             {ICONS[item.icon]}
//           </NavLink>
//         ))}
//       </nav>
//       <button
//         onClick={logout}
//         title="Logout"
//         className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-bold text-txt-secondary hover:text-danger hover:border-danger/30 transition-colors"
//       >
//         {user?.name?.[0]?.toUpperCase() || '?'}
//       </button>
//     </aside>
//   );
// }

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  ChefHat,
  ClipboardList,
  UtensilsCrossed,
  Armchair,
  Users,
  CreditCard,
  User,
  LogOut,
} from 'lucide-react';

const ICON_MAP = {
  dashboard: LayoutDashboard,
  kitchen: ChefHat,
  orders: ClipboardList,
  menu: UtensilsCrossed,
  tables: Armchair,
  users: Users,
  payments: CreditCard,
  profile: User,
};

const NAV = {
  admin: [
    { group: 'Overview', items: [
      { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
    ]},
    { group: 'Operations', items: [
      { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
      { to: '/admin/orders', icon: 'orders', label: 'Orders' },
    ]},
    { group: 'Management', items: [
      { to: '/admin/menu', icon: 'menu', label: 'Menu' },
      { to: '/admin/tables', icon: 'tables', label: 'Tables' },
      { to: '/admin/users', icon: 'users', label: 'Users' },
      { to: '/admin/payments', icon: 'payments', label: 'Payments' },
    ]},
  ],
  staff: [
    { group: 'Operations', items: [
      { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
      { to: '/staff/orders', icon: 'orders', label: 'Orders' },
    ]},
    { group: 'Overview', items: [
      { to: '/staff', icon: 'dashboard', label: 'Dashboard' },
    ]},
  ],
  customer: [
    { group: 'Order', items: [
      { to: '/menu', icon: 'menu', label: 'Menu' },
      { to: '/my-orders', icon: 'orders', label: 'My Orders' },
    ]},
    { group: 'Account', items: [
      { to: '/profile', icon: 'profile', label: 'Profile' },
    ]},
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = NAV[user?.role] || NAV.customer;

  return (
    <aside className="hidden md:flex flex-col w-[240px] bg-bg-secondary border-r border-border shrink-0">
      {/* Logo / Brand */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-3 px-5 py-5 border-b border-border hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-glow shrink-0">
          R
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-txt-primary leading-tight">Restaurant</p>
          <p className="text-[10px] text-txt-muted uppercase tracking-wider">
            {user?.role || 'Guest'}
          </p>
        </div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {nav.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-txt-disabled">
              {section.group}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin' || item.to === '/staff'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-primary/15 text-primary border border-primary/25'
                        : 'text-txt-secondary hover:text-txt-primary hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    {Icon && <Icon size={18} strokeWidth={2} />}
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-txt-primary truncate">
              {user?.name || 'Guest'}
            </p>
            <p className="text-[10px] text-txt-muted truncate">
              {user?.email || ''}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-txt-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}