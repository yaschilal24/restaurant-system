
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const AppError = require('../utils/AppError');

const orderModel = require('../models/orderModel');
const paymentModel = require('../models/paymentModel');

const paymentService =
  require('../services/paymentService');

const chapaService =
  require('../services/chapaService');


/**
 * POST /api/payments/chapa/initialize
 */
const initializeChapa = asyncHandler(
  async (req, res) => {

    const { orderId } = req.body;

    console.log(
      '💳 Initialize payment request:',
      { orderId }
    );

    if (!orderId) {
      throw new AppError(
        'Order ID is required.',
        400
      );
    }


    const { rows } =
      await orderModel.findById(orderId);


    if (!rows.length) {
      throw new AppError(
        'Order not found.',
        404
      );
    }


    const order = rows[0];

    console.log(
      '🧾 Payment order:',
      {
        id: order.id,
        order_number: order.order_number,
        total: order.total,
      }
    );


    const result =
      await chapaService.initializePayment(order);


    await paymentModel.create({
      order_id: order.id,

      provider: 'chapa',

      reference: result.tx_ref,

      amount: order.total,

      status: 'pending',
    });


    success(res, {
      checkout_url:
        result.checkout_url,

      tx_ref:
        result.tx_ref,
    });
  }
);


/**
 * GET /api/payments/verify/:reference
 */
const verify = asyncHandler(
  async (req, res) => {

    const { reference } =
      req.params;


    if (!reference) {
      throw new AppError(
        'Payment reference is required.',
        400
      );
    }


    const data =
      await chapaService.verifyPayment(
        reference
      );


    const paymentResult =
      await paymentModel.findByReference(
        reference
      );


    const payment =
      paymentResult.rows[0];


    if (
      data.status === 'success' &&
      data.data?.status === 'success'
    ) {

      if (payment) {

        await paymentService.markAsPaid(
          payment.order_id,
          {
            provider: 'chapa',

            reference,

            amount:
              payment.amount,

            raw: data,
          }
        );

        console.log(
          '✅ Payment marked as paid:',
          reference
        );
      }
    }


    success(res, data);
  }
);


/**
 * GET /api/payments
 */
const list = asyncHandler(
  async (req, res) => {

    const result =
      await paymentModel.list();

    success(
      res,
      result.rows
    );
  }
);

const syncPending = asyncHandler(async (req, res) => {
  const pool = require('../db/pool');
  const orderModel = require('../models/orderModel');
  const paymentModel = require('../models/paymentModel');
  const chapaService = require('../services/chapaService');

  // Find all pending Chapa payments
  const { rows: pending } = await pool.query(
    `SELECT * FROM payments 
     WHERE status = 'pending' AND provider = 'chapa' 
     ORDER BY created_at DESC LIMIT 50`
  );

  let updated = 0;
  let failed = 0;

  for (const payment of pending) {
    try {
      const result = await chapaService.verifyPayment(payment.reference);
      
      if (result.status === 'success' && result.data?.status === 'success') {
        await paymentModel.updateStatus(payment.id, 'paid', result);
        await orderModel.updatePaymentStatus(payment.order_id, 'paid');
        updated++;
      } else if (result.data?.status === 'failed') {
        await paymentModel.updateStatus(payment.id, 'failed', result);
        failed++;
      }
    } catch (err) {
      console.error(`Sync failed for ${payment.reference}:`, err.message);
    }
  }

  success(res, { checked: pending.length, updated, failed });
});

module.exports = {
  initializeChapa,
  verify,
  list,
  syncPending,
};