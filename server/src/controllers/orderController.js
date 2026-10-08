const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const AppError = require('../utils/AppError');
const orderService = require('../services/orderService');
const orderItemModel = require('../models/orderItemModel');
const { canTransition } = require('../utils/orderStatus');
const { emitNewOrder, emitOrderUpdate } = require('../sockets/socketServer');

const create = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder({
    userId: req.user?.id || null,
    items: req.body.items,
    orderType: req.body.order_type,
    tableToken: req.body.table_token,
    customerName: req.body.customer_name,
    customerPhone: req.body.customer_phone,
    deliveryAddress: req.body.delivery_address,
    notes: req.body.notes,
    paymentMethod: req.body.payment_method || 'cash',
  });

  emitNewOrder({
    orderId: result.order.id, orderNumber: result.order.order_number,
    orderType: result.order.order_type, tableId: result.order.table_id,
    items: result.items, total: result.order.total, createdAt: result.order.created_at,
  });

  success(res, result, 201);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*, (SELECT json_agg(json_build_object(
      'name', oi.name_snapshot, 'price', oi.unit_price_snapshot, 'quantity', oi.quantity))
      FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o WHERE o.user_id = $1 ORDER BY o.created_at DESC LIMIT 50`, [req.user.id]
  );
  success(res, rows);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT o.*, t.table_number FROM orders o
     LEFT JOIN restaurant_tables t ON o.table_id = t.id
     WHERE o.id::text = $1 OR o.tracking_token = $1 OR o.order_number = $1`, [id]
  );
  if (!rows.length) throw new AppError('Order not found', 404);
  const order = rows[0];
  const isGuestWithToken = !req.user && (order.tracking_token === id || order.order_number === id);
  const isOwner = req.user && order.user_id === req.user.id;
  const isStaff = req.user && ['staff', 'admin'].includes(req.user.role);
  if (!isGuestWithToken && !isOwner && !isStaff) throw new AppError('Access denied', 403);
  const items = (await orderItemModel.findByOrder(order.id)).rows;
  success(res, { ...order, items });
});

const list = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*, t.table_number,
      (SELECT json_agg(json_build_object(
        'name', oi.name_snapshot, 'price', oi.unit_price_snapshot, 'quantity', oi.quantity))
       FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o LEFT JOIN restaurant_tables t ON o.table_id = t.id
     ${req.query.status && req.query.status !== 'all' ? `WHERE o.status = $1` : ''}
     ORDER BY o.created_at DESC LIMIT ${Number(req.query.limit) || 50}`,
    req.query.status && req.query.status !== 'all' ? [req.query.status] : []
  );
  success(res, {
    orders: rows,
    pagination: { page: 1, limit: 50, total: rows.length, totalPages: 1 },
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (!rows.length) throw new AppError('Order not found', 404);
  const order = rows[0];
  // ✅ NEW: Same status → no-op success
  if (order.status === status) {
    return success(res, order);
  }

  if (req.user.role === 'customer') {
    if (order.user_id !== req.user.id) throw new AppError('Access denied', 403);
    if (status !== 'cancelled') throw new AppError('Customers can only cancel orders', 403);
  }

  if (!canTransition(order.status, status)) {
    throw new AppError(`Cannot transition from "${order.status}" to "${status}"`, 400);
  }

  const { rows: updated } = await pool.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]
  );
    // Only auto-pay CASH orders. Chapa orders should already be paid.
  // if (updated[0].payment_method === 'cash') {
  //   await pool.query(
  //     'UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2',
  //     ['paid', id]
  //   );

  //   // Insert a payment record
  //   await pool.query(
  //     `INSERT INTO payments (order_id, provider, reference, amount, status)
  //      VALUES ($1, $2, $3, $4, $5)`,
  //     [id, 'cash', `CASH-${updated[0].order_number}`, updated[0].total, 'paid']
  //   );

  //   updated[0].payment_status = 'paid';
  // }

  //new add auto pay for cash orders
    if (status === 'completed' && updated[0].payment_method === 'cash' && updated[0].payment_status === 'unpaid') {
    await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE id = $2',
      ['paid', id]
    );
    await pool.query(
      `INSERT INTO payments (order_id, provider, reference, amount, status)
       VALUES ($1, 'cash', $2, $3, 'paid')
       ON CONFLICT (reference) DO NOTHING`,
      [id, `CASH-${updated[0].order_number}`, updated[0].total]
    );
    updated[0].payment_status = 'paid';
  }



  emitOrderUpdate({
    orderId: order.id, orderNumber: order.order_number,
    status, trackingToken: order.tracking_token,
  });

  success(res, updated[0]);
});

module.exports = { create, getMyOrders, getById, list, updateStatus };