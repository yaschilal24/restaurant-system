const { body } = require('express-validator');
module.exports = {
  create: [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('category_id').isInt().withMessage('Category required'),
  ],
};