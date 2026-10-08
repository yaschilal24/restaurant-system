const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const pool = require('../db/pool');

const stats = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM orders) AS total_orders,
      (SELECT COUNT(*)::int FROM menu_items) AS total_menu_items,
      (SELECT COUNT(*)::int FROM restaurant_tables) AS total_tables
  `);
  success(res, rows[0]);
});

module.exports = { stats };