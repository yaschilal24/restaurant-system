const pool = require('../db/pool');
module.exports = {
  list: (params = {}) => {
    const conditions = [];
    const values = [];
    let i = 1;
    if (params.category) { conditions.push(`m.category_id = $${i++}`); values.push(params.category); }
    if (params.search) { conditions.push(`(m.name ILIKE $${i} OR m.description ILIKE $${i})`); values.push(`%${params.search}%`); i++; }
    if (params.available) conditions.push(`m.is_available = true`);
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return pool.query(
      `SELECT m.*, c.name AS category_name FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       ${where} ORDER BY m.is_featured DESC, m.name`,
      values
    );
  },
  findById: (id) => pool.query(
    `SELECT m.*, c.name AS category_name FROM menu_items m
     JOIN categories c ON m.category_id = c.id WHERE m.id = $1`, [id]
  ),
  create: (data) => pool.query(
    `INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, is_featured, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.category_id, data.name, data.description, data.price, data.image_url, data.is_available ?? true, data.is_featured ?? false, data.tags || []]
  ),
  update: (id, data) => pool.query(
    `UPDATE menu_items SET category_id = $1, name = $2, description = $3, price = $4,
     image_url = $5, is_available = $6, is_featured = $7, tags = $8, updated_at = NOW()
     WHERE id = $9 RETURNING *`,
    [data.category_id, data.name, data.description, data.price, data.image_url, data.is_available, data.is_featured, data.tags || [], id]
  ),
  updateAvailability: (id, is_available) => pool.query(
    'UPDATE menu_items SET is_available = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [is_available, id]
  ),
  remove: (id) => pool.query('DELETE FROM menu_items WHERE id = $1', [id]),
};