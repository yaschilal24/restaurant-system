const orderModel = require('../models/orderModel');
const paymentModel = require('../models/paymentModel');
const AppError = require('../utils/AppError');

async function markAsPaid(orderId, { provider, reference, amount, raw }) {
  const existing = reference ? await paymentModel.findByReference(reference) : { rows: [] };
  if (existing.rows.length && existing.rows[0].status === 'paid') return existing.rows[0];

  const { rows } = await paymentModel.create({
    order_id: orderId, provider, reference, amount,
    status: 'paid', raw_response: raw,
  });
  await orderModel.updatePaymentStatus(orderId, 'paid');
  return rows[0];
}

async function markAsFailed(orderId, { provider, reference, amount, raw }) {
  return (await paymentModel.create({
    order_id: orderId, provider, reference, amount, status: 'failed', raw_response: raw,
  })).rows[0];
}

module.exports = { markAsPaid, markAsFailed };