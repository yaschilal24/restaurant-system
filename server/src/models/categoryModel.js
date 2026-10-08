const pool = require('../db/pool');
module.exports = {
  list: () => pool.query(`
    SELECT c.*, COUNT(m.id)::int AS item_count
    FROM categories c LEFT JOIN menu_items m ON m.category_id = c.id
    WHERE c.is_active = true
    GROUP BY c.id ORDER BY c.sort_order, c.name
  `),
  findById: (id) => pool.query('SELECT * FROM categories WHERE id = $1', [id]),
  create: (data) => pool.query(
    'INSERT INTO categories (name, description, sort_order) VALUES ($1, $2, $3) RETURNING *',
    [data.name, data.description, data.sort_order || 0]
  ),
  update: (id, data) => pool.query(
    'UPDATE categories SET name = $1, description = $2, sort_order = $3 WHERE id = $4 RETURNING *',
    [data.name, data.description, data.sort_order || 0, id]
  ),
  remove: (id) => pool.query('DELETE FROM categories WHERE id = $1', [id]),
  countItems: (id) => pool.query('SELECT COUNT(*)::int AS count FROM menu_items WHERE category_id = $1', [id]),
};