const pool = require('../db/pool');
module.exports = {
  create: (data) => pool.query(
    `INSERT INTO orders
     (order_number, user_id, order_type, table_id, payment_method, subtotal, tax, total,
      delivery_address, customer_name, customer_phone, notes, tracking_token)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [data.order_number, data.user_id, data.order_type, data.table_id, data.payment_method,
     data.subtotal, data.tax, data.total, data.delivery_address, data.customer_name,
     data.customer_phone, data.notes, data.tracking_token]
  ),
  findById: (id) => pool.query(
    `SELECT o.*, t.table_number FROM orders o
     LEFT JOIN restaurant_tables t ON o.table_id = t.id WHERE o.id = $1`, [id]
  ),
  findByToken: (token) => pool.query(
    `SELECT o.*, t.table_number FROM orders o
     LEFT JOIN restaurant_tables t ON o.table_id = t.id WHERE o.tracking_token = $1 OR o.order_number = $1`, [token]
  ),
  findByUser: (userId) => pool.query(
    `SELECT o.*, t.table_number,
      (SELECT json_agg(json_build_object('name', oi.name_snapshot, 'price', oi.unit_price_snapshot, 'quantity', oi.quantity))
       FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o LEFT JOIN restaurant_tables t ON o.table_id = t.id
     WHERE o.user_id = $1 ORDER BY o.created_at DESC LIMIT 50`, [userId]
  ),
  list: (params = {}) => {
    const conditions = [];
    const values = [];
    let i = 1;
    if (params.status && params.status !== 'all') { conditions.push(`o.status = $${i++}`); values.push(params.status); }
    if (params.order_type) { conditions.push(`o.order_type = $${i++}`); values.push(params.order_type); }
    if (params.date_from) { conditions.push(`o.created_at >= $${i++}`); values.push(params.date_from); }
    if (params.date_to) { conditions.push(`o.created_at <= $${i++}`); values.push(params.date_to); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = Number(params.limit || 20);
    const offset = (Number(params.page || 1) - 1) * limit;
    return pool.query(
      `SELECT o.*, t.table_number,
        (SELECT json_agg(json_build_object('name', oi.name_snapshot, 'price', oi.unit_price_snapshot, 'quantity', oi.quantity))
         FROM order_items oi WHERE oi.order_id = o.id) AS items
       FROM orders o LEFT JOIN restaurant_tables t ON o.table_id = t.id
       ${where} ORDER BY o.created_at DESC LIMIT $${i++} OFFSET $${i++}`,
      [...values, limit, offset]
    );
  },
  updateStatus: (id, status) => pool.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]
  ),
  updatePaymentStatus: (id, status) => pool.query(
    'UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]
  ),
};