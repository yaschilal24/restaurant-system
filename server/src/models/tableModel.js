const pool = require('../db/pool');
module.exports = {
  list: () => pool.query(`
    SELECT t.*, COUNT(o.id)::int AS order_count FROM restaurant_tables t
    LEFT JOIN orders o ON o.table_id = t.id GROUP BY t.id ORDER BY t.table_number
  `),
  findByToken: (token) => pool.query(
    'SELECT id, table_number, capacity, location FROM restaurant_tables WHERE qr_token = $1 AND is_active = true', [token]
  ),
  findById: (id) => pool.query('SELECT * FROM restaurant_tables WHERE id = $1', [id]),
  create: (data) => pool.query(
    'INSERT INTO restaurant_tables (table_number, qr_token, capacity, location) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.table_number, data.qr_token, data.capacity || 4, data.location]
  ),
  remove: (id) => pool.query('DELETE FROM restaurant_tables WHERE id = $1', [id]),
};