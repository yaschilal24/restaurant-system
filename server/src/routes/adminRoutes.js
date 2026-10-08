const express = require('express');
const c = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();
router.get('/stats', authenticate, authorize('admin'), c.stats);
module.exports = router;