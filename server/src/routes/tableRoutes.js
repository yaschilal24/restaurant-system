const express = require('express');
const c = require('../controllers/tableController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();
router.get('/', authenticate, authorize('admin', 'staff'), c.list);
router.get('/token/:token', c.getByToken);
router.post('/', authenticate, authorize('admin'), c.create);
router.delete('/:id', authenticate, authorize('admin'), c.remove);
module.exports = router;