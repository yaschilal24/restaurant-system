import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import CustomerLayout from '../layouts/CustomerLayout';
import StaffLayout from '../layouts/StaffLayout';
import AdminLayout from '../layouts/AdminLayout';
import Payments from '../pages/admin/Payments';


// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Public
import Home from '../pages/public/Home';
import PublicMenu from '../pages/public/Menu';
import RestaurantInfo from '../pages/public/RestaurantInfo';

// Customer
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import OrderTracking from '../pages/customer/OrderTracking';
import MyOrders from '../pages/customer/MyOrders';
import OrderDetails from '../pages/customer/OrderDetails';
import Profile from '../pages/customer/Profile';

// Kitchen & Staff
import KitchenDashboard from '../pages/kitchen/KitchenDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffOrders from '../pages/staff/StaffOrders';
import StaffOrderDetails from '../pages/staff/StaffOrderDetails';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminOrderDetails from '../pages/admin/AdminOrderDetails';
import MenuManagement from '../pages/admin/MenuManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import TableManagement from '../pages/admin/TableManagement';
import UserManagement from '../pages/admin/UserManagement';
import Analytics from '../pages/admin/Analytics';
import Settings from '../pages/admin/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<PublicMenu />} />
      <Route path="/info" element={<RestaurantInfo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/t/:token" element={<PublicMenu />} />

      {/* Customer */}
      <Route element={<ProtectedRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Staff */}
      <Route element={<ProtectedRoute roles={['staff', 'admin']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/orders" element={<StaffOrders />} />
          <Route path="/staff/orders/:id" element={<StaffOrderDetails />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/tables" element={<TableManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/payments" element={<Payments />} />   {/* ← MUST exist */}

          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}