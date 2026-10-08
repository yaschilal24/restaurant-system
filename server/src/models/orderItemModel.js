const pool = require('../db/pool');
module.exports = {
  createMany: async (client, orderId, items) => {
    const results = [];
    for (const item of items) {
      const { rows } = await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, name_snapshot, unit_price_snapshot, quantity)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [orderId, item.menu_item_id, item.name_snapshot, item.unit_price_snapshot, item.quantity]
      );
      results.push(rows[0]);
    }
    return results;
  },
  findByOrder: (orderId) => pool.query(
    'SELECT id, name_snapshot AS name, unit_price_snapshot AS price, quantity FROM order_items WHERE order_id = $1',
    [orderId]
  ),
};