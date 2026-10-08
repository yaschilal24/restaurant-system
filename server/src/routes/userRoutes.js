const express = require('express');
const c = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();
router.get('/', authenticate, authorize('admin'), c.list);
router.post('/staff', authenticate, authorize('admin'), c.createStaff);
router.patch('/:id/role', authenticate, authorize('admin'), c.updateRole);
module.exports = router;