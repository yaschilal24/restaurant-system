const { body } = require('express-validator');
module.exports = { initialize: [body('orderId').isInt().withMessage('Order ID required')] };