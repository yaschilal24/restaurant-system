const rateLimit = require('express-rate-limit');

module.exports = {
  authLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    message: { success: false, message: 'Too many attempts. Try again later.' },
    standardHeaders: true, legacyHeaders: false,
  }),
  orderLimiter: rateLimit({
    windowMs: 60 * 1000, max: 10,
    message: { success: false, message: 'Too many orders. Slow down.' },
  }),
};