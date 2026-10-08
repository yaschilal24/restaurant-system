const { body } = require('express-validator');
module.exports = { create: [body('table_number').trim().notEmpty().withMessage('Table number required')] };