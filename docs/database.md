# Database Schema

## Indexes
- `users(email)`, `users(role)`
- `menu_items(category_id)`, `menu_items(is_available)`
- `restaurant_tables(qr_token)`
- `orders(status)`, `orders(created_at DESC)`, `orders(user_id)`, `orders(order_number)`, `orders(tracking_token)`
- `order_items(order_id)`, `payments(order_id)`