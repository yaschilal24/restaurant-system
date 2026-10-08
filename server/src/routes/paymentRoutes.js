// const express = require('express');
// const c = require('../controllers/paymentController');
// const { authenticate } = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');

// const router = express.Router();
// router.post('/chapa/initialize', authenticate, c.initializeChapa);
// router.get('/verify/:reference', c.verify);
// router.get('/', authenticate, authorize('admin', 'staff'), c.list);
// module.exports = router;





// const express = require('express');
// const c = require('../controllers/paymentController');
// const { authenticate } = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');

// const router = express.Router();

// // Initialize Chapa payment
// router.post('/chapa/initialize', authenticate, c.initializeChapa);

// // Verify payment by reference
// router.get('/verify/:reference', c.verify);

// // List payments (admin/staff)
// router.get('/', authenticate, authorize('admin', 'staff'), c.list);

// // ✅ CHAPA WEBHOOK — public, no auth
// router.post('/chapa/webhook', async (req, res) => {
//   console.log('📩 Chapa webhook received:', req.body);

//   try {
//     const { tx_ref, status } = req.body;

//     if (status === 'success' && tx_ref) {
//       const paymentModel = require('../models/paymentModel');
//       const paymentService = require('../services/paymentService');

//       const existing = await paymentModel.findByReference(tx_ref);
//       if (existing.rows.length && existing.rows[0].status !== 'paid') {
//         await paymentService.markAsPaid(existing.rows[0].order_id, {
//           provider: 'chapa',
//           reference: tx_ref,
//           amount: existing.rows[0].amount,
//           raw: req.body,
//         });
//         console.log('✅ Payment marked paid via webhook:', tx_ref);
//       }
//     }
//   } catch (err) {
//     console.error('❌ Webhook error:', err);
//   }

//   res.status(200).json({ success: true });
// });

// module.exports = router;



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