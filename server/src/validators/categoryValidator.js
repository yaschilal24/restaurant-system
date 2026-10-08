const { body } = require('express-validator');
module.exports = { create: [body('name').trim().notEmpty().withMessage('Name required')] };