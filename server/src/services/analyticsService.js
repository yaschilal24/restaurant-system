const pool = require('../db/pool');

async function getDashboard(period = 'today') {
  const filters = {
    today: "DATE(created_at) = CURRENT_DATE",
    week: "created_at >= NOW() - INTERVAL '7 days'",
    month: "created_at >= NOW() - INTERVAL '30 days'",
  };
  const dateFilter = filters[period] || filters.today;

  const [summary, byStatus, byType, topItems, dailySales] = await Promise.all([
    pool.query(`SELECT COALESCE(SUM(total), 0)::float AS gross_revenue,
      COUNT(*)::int AS total_orders, COALESCE(AVG(total), 0)::float AS avg_ticket
      FROM orders WHERE ${dateFilter} AND status != 'cancelled'`),
    pool.query(`SELECT status, COUNT(*)::int AS count FROM orders WHERE ${dateFilter} GROUP BY status`),
    pool.query(`SELECT order_type, COUNT(*)::int AS count FROM orders WHERE ${dateFilter} GROUP BY order_type`),
    pool.query(`SELECT oi.name_snapshot AS name, SUM(oi.quantity)::int AS total_quantity,
      SUM(oi.quantity * oi.unit_price_snapshot)::float AS total_revenue
      FROM order_items oi JOIN orders o ON oi.order_id = o.id
      WHERE ${dateFilter.replace(/created_at/g, 'o.created_at')} AND o.status != 'cancelled'
      GROUP BY oi.name_snapshot ORDER BY total_revenue DESC LIMIT 10`),
    pool.query(`SELECT DATE(created_at) AS date, SUM(total)::float AS revenue, COUNT(*)::int AS orders
      FROM orders WHERE created_at >= NOW() - INTERVAL '30 days' AND status != 'cancelled'
      GROUP BY DATE(created_at) ORDER BY date`),
  ]);

  return {
    summary: summary.rows[0], byStatus: byStatus.rows, byType: byType.rows,
    topItems: topItems.rows, dailySales: dailySales.rows,
  };
}

module.exports = { getDashboard };