const { body } = require('express-validator');
module.exports = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('At least one item'),
    body('items.*.menu_item_id').isInt().withMessage('Invalid menu item ID'),
    body('items.*.quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity 1-99'),
    body('order_type').isIn(['dine_in', 'pickup', 'delivery']).withMessage('Invalid order type'),
  ],
};