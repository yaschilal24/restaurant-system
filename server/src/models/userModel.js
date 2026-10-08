const pool = require('../db/pool');
module.exports = {
  findById: (id) => pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [id]),
  findByEmail: (email) => pool.query('SELECT * FROM users WHERE email = $1', [email]),
  create: (data) => pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, created_at`,
    [data.name, data.email, data.phone, data.passwordHash, data.role || 'customer']
  ),
  list: (params = {}) => {
    const conditions = [];
    const values = [];
    let i = 1;
    if (params.role) { conditions.push(`role = $${i++}`); values.push(params.role); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return pool.query(`SELECT id, name, email, phone, role, created_at FROM users ${where} ORDER BY created_at DESC`, values);
  },
  updateRole: (id, role) => pool.query('UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role', [role, id]),
};