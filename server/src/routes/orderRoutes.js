// const express = require('express');
// const c = require('../controllers/orderController');
// const { authenticate, optionalAuth } = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
// const { orderLimiter } = require('../middleware/rateLimiter');
// const validate = require('../middleware/validate');
// const { create: createV } = require('../validators/orderValidator');

// const router = express.Router();
// router.post('/', optionalAuth, orderLimiter, createV, validate, c.create);
// router.get('/my', authenticate, c.getMyOrders);
// router.get('/:id', optionalAuth, c.getById);
// router.get('/', authenticate, authorize('staff', 'admin'), c.list);
// router.patch('/:id/status', authenticate, authorize('staff', 'admin', 'customer'), c.updateStatus);
// module.exports = router;

const express = require('express');
const {
  create, getMyOrders, getById, list, updateStatus,
} = require('../controllers/orderController');
const { authenticate, optionalAuth } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { orderLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { create: createV } = require('../validators/orderValidator');

const router = express.Router();

// ✅ Public — guests allowed for dine-in via QR
router.post('/', optionalAuth, orderLimiter, createV, validate, create);

// 🔒 Auth required
router.get('/my', authenticate, getMyOrders);
router.get('/:id', optionalAuth, getById);
router.get('/', authenticate, authorize('staff', 'admin'), list);
router.patch(
  '/:id/status',
  authenticate,
  authorize('staff', 'admin', 'customer'),
  updateStatus
);

module.exports = router;