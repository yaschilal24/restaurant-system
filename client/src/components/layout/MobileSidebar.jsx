// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const ICONS = { menu: '🍽️', orders: '📋', kitchen: '👨‍🍳', dashboard: '📊', profile: '👤' };

// export default function MobileSidebar() {
//   const { user } = useAuth();

//   const nav = user?.role === 'admin' ? [
//     { to: '/admin', icon: 'dashboard', label: 'Admin' },
//     { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
//     { to: '/admin/orders', icon: 'orders', label: 'Orders' },
//   ] : user?.role === 'staff' ? [
//     { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
//     { to: '/staff/orders', icon: 'orders', label: 'Orders' },
//   ] : [
//     { to: '/menu', icon: 'menu', label: 'Menu' },
//     { to: '/my-orders', icon: 'orders', label: 'Orders' },
//     { to: '/profile', icon: 'profile', label: 'Profile' },
//   ];

//   return (
//     <nav className="md:hidden flex items-center justify-around bg-bg-secondary border-t border-border py-2">
//       {nav.map((item) => (
//         <NavLink
//           key={item.to}
//           to={item.to}
//           className={({ isActive }) =>
//             `flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium transition-colors
//              ${isActive ? 'text-primary' : 'text-txt-muted'}`
//           }
//         >
//           <span className="text-lg">{ICONS[item.icon]}</span>
//           {item.label}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, ChefHat, ClipboardList, UtensilsCrossed, User,
} from 'lucide-react';

const ICON_MAP = {
  dashboard: LayoutDashboard,
  kitchen: ChefHat,
  orders: ClipboardList,
  menu: UtensilsCrossed,
  profile: User,
};

export default function MobileSidebar() {
  const { user } = useAuth();

  const nav = user?.role === 'admin' ? [
    { to: '/admin', icon: 'dashboard', label: 'Admin' },
    { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
    { to: '/admin/orders', icon: 'orders', label: 'Orders' },
  ] : user?.role === 'staff' ? [
    { to: '/kitchen', icon: 'kitchen', label: 'Kitchen' },
    { to: '/staff/orders', icon: 'orders', label: 'Orders' },
  ] : [
    { to: '/menu', icon: 'menu', label: 'Menu' },
    { to: '/my-orders', icon: 'orders', label: 'Orders' },
    { to: '/profile', icon: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="md:hidden flex items-center justify-around bg-bg-secondary border-t border-border py-2">
      {nav.map((item) => {
        const Icon = ICON_MAP[item.icon];
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/staff'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium transition-colors
               ${isActive ? 'text-primary' : 'text-txt-muted'}`
            }
          >
            {Icon && <Icon size={20} strokeWidth={2} />}
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}