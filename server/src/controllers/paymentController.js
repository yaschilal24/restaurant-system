// const asyncHandler = require('../utils/asyncHandler');
// const { success } = require('../utils/response');
// const AppError = require('../utils/AppError');
// const orderModel = require('../models/orderModel');
// const paymentModel = require('../models/paymentModel');
// const paymentService = require('../services/paymentService');
// const chapaService = require('../services/chapaService');

// const initializeChapa = asyncHandler(async (req, res) => {
//   const { orderId } = req.body;
//   const { rows } = await orderModel.findById(orderId);
//   if (!rows.length) throw new AppError('Order not found', 404);
//   const order = rows[0];

//   const result = await chapaService.initializePayment(order);
//   await paymentModel.create({
//     order_id: order.id, provider: 'chapa', reference: result.tx_ref,
//     amount: order.total, status: 'pending',
//   });
//   success(res, { checkout_url: result.checkout_url, tx_ref: result.tx_ref });
// });

// const verify = asyncHandler(async (req, res) => {
//   const { reference } = req.params;
//   const data = await chapaService.verifyPayment(reference);
//   if (data.status === 'success' && data.data?.status === 'success') {
//     const payment = (await paymentModel.findByReference(reference)).rows[0];
//     if (payment) {
//       await paymentService.markAsPaid(payment.order_id, {
//         provider: 'chapa', reference, amount: payment.amount, raw: data,
//       });
//     }
//   }
//   success(res, data);
// });

// const list = asyncHandler(async (req, res) => success(res, (await paymentModel.list()).rows));

// module.exports = { initializeChapa, verify, list };


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


module.exports = {
  initializeChapa,
  verify,
  list,
};