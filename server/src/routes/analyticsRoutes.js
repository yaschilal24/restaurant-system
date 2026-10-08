const express = require('express');
const c = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();
router.get('/dashboard', authenticate, authorize('staff', 'admin'), c.getDashboard);
module.exports = router;