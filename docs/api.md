# API Reference

## Auth
- `POST /api/auth/register` — `{ name, email, phone?, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET  /api/auth/me` — Bearer required

## Menu
- `GET /api/menu/categories`
- `GET /api/menu?category=&search=&available=true`
- `GET /api/menu/:id`
- `POST /api/menu` (admin)
- `PUT /api/menu/:id` (admin)
- `PATCH /api/menu/:id/availability` (admin)
- `DELETE /api/menu/:id` (admin)
- `POST /api/menu/upload` (admin, multipart)

## Categories
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

## Orders
- `POST /api/orders` — `{ items, order_type, table_token?, ... }`
- `GET /api/orders/my` — auth
- `GET /api/orders/:id` — owner/staff/guest-with-token
- `GET /api/orders?status=&limit=` — staff/admin
- `PATCH /api/orders/:id/status` — `{ status }`

## Tables
- `GET /api/tables` (staff/admin)
- `GET /api/tables/token/:token` (public)
- `POST /api/tables` (admin)

## Payments
- `POST /api/payments/chapa/initialize` — `{ orderId }`
- `GET /api/payments/verify/:reference`
- `GET /api/payments` (staff/admin)

## Users (Admin)
- `GET /api/users`
- `POST /api/users/staff`
- `PATCH /api/users/:id/role`

## Analytics
- `GET /api/analytics/dashboard?period=today|week|month` (staff/admin)

## Health
- `GET /api/health`