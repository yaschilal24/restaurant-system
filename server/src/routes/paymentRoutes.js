
const express = require('express');

const c =
  require('../controllers/paymentController');

const {
  authenticate,
} = require('../middleware/authenticate');

const authorize =
  require('../middleware/authorize');

const router =
  express.Router();


/**
 * Initialize Chapa payment
 */
router.post(
  '/chapa/initialize',
  authenticate,
  c.initializeChapa
);


/**
 * Verify payment
 */
router.get(
  '/verify/:reference',
  c.verify
);

// ✅ Sync all pending payments with Chapa
router.post('/sync-pending', authenticate, authorize('admin'), c.syncPending);

/**
 * Admin/staff payment list
 */
router.get(
  '/',
  authenticate,
  authorize('admin', 'staff'),
  c.list
);


/**
 * Chapa webhook
 */
router.post(
  '/chapa/webhook',
  async (req, res) => {

    console.log(
      '📩 Chapa webhook received:'
    );

    console.dir(req.body, {
      depth: null,
    });


    try {

      const txRef =
        req.body.tx_ref ||
        req.body.reference;


      if (!txRef) {
        console.log(
          '⚠️ Webhook has no transaction reference'
        );

        return res
          .status(200)
          .json({
            success: true,
          });
      }


      const paymentModel =
        require('../models/paymentModel');

      const paymentService =
        require('../services/paymentService');

      const chapaService =
        require('../services/chapaService');


      const existing =
        await paymentModel.findByReference(
          txRef
        );


      if (!existing.rows.length) {

        console.log(
          '⚠️ Payment not found:',
          txRef
        );

        return res
          .status(200)
          .json({
            success: true,
          });
      }


      const payment =
        existing.rows[0];


      if (payment.status === 'paid') {

        console.log(
          'ℹ️ Payment already paid:',
          txRef
        );

        return res
          .status(200)
          .json({
            success: true,
          });
      }


      // Verify directly with Chapa
      const verified =
        await chapaService.verifyPayment(
          txRef
        );


      if (
        verified.status === 'success' &&
        verified.data?.status === 'success'
      ) {

        await paymentService.markAsPaid(
          payment.order_id,
          {
            provider: 'chapa',

            reference: txRef,

            amount: payment.amount,

            raw: verified,
          }
        );


        console.log(
          '✅ Payment verified and marked paid:',
          txRef
        );
      }

    } catch (error) {

      console.error(
        '❌ Webhook error:',
        error
      );
    }


    return res
      .status(200)
      .json({
        success: true,
      });
  }
);


module.exports = router;