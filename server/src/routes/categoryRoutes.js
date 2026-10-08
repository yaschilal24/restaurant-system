const express = require('express');
const c = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { create: createV } = require('../validators/categoryValidator');

const router = express.Router();
router.post('/', authenticate, authorize('admin'), createV, validate, c.create);
router.put('/:id', authenticate, authorize('admin'), c.update);
router.delete('/:id', authenticate, authorize('admin'), c.remove);
module.exports = router;