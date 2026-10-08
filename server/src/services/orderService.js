const pool = require('../db/pool');
const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
const tableModel = require('../models/tableModel');
const AppError = require('../utils/AppError');
const { calculateTotals } = require('../utils/calculations');
const { generateOrderNumber, generateTrackingToken } = require('../utils/trackingToken');

async function createOrder({
  userId, items, orderType, tableToken, customerName, customerPhone, deliveryAddress, notes, paymentMethod = 'cash',
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ids = items.map((i) => i.menu_item_id);
    const { rows: menuItems } = await client.query(
      'SELECT id, name, price, is_available FROM menu_items WHERE id = ANY($1::int[])', [ids]
    );
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));

    for (const item of items) {
      const m = menuMap.get(item.menu_item_id);
      if (!m) throw new AppError(`Menu item ${item.menu_item_id} not found`, 400);
      if (!m.is_available) throw new AppError(`"${m.name}" is currently unavailable`, 400);
      if (item.quantity < 1 || item.quantity > 99) throw new AppError('Quantity must be 1-99', 400);
    }

    const orderItems = items.map((item) => {
      const m = menuMap.get(item.menu_item_id);
      return {
        menu_item_id: m.id,
        name_snapshot: m.name,
        unit_price_snapshot: Number(m.price),
        quantity: item.quantity,
      };
    });

    const { subtotal, tax, total } = calculateTotals(orderItems);

    let tableId = null;
    if (tableToken) {
      const { rows } = await client.query(
        'SELECT id FROM restaurant_tables WHERE qr_token = $1 AND is_active = true', [tableToken]
      );
      if (!rows.length) throw new AppError('Invalid table QR code', 400);
      tableId = rows[0].id;
    }

    if (orderType === 'delivery' && !deliveryAddress) throw new AppError('Delivery address required', 400);
    if (orderType === 'dine_in' && !tableId) throw new AppError('Table required for dine-in', 400);

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (order_number, user_id, order_type, table_id, payment_method,
        subtotal, tax, total, delivery_address, customer_name, customer_phone, notes, tracking_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [generateOrderNumber(), userId || null, orderType, tableId, paymentMethod,
       subtotal, tax, total, deliveryAddress || null, customerName || null,
       customerPhone || null, notes || null, generateTrackingToken()]
    );
    const order = orderRows[0];

    await orderItemModel.createMany(client, order.id, orderItems);

    await client.query('COMMIT');
    return { order, items: orderItems };
  } catch (e) {
    await client.query('ROLLBACK'); throw e;
  } finally { client.release(); }
}

module.exports = { createOrder };