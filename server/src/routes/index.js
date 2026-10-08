const express = require('express');
const router = express.Router();

router.use('/health', require('./healthRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/menu', require('./menuRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/tables', require('./tableRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/analytics', require('./analyticsRoutes'));

module.exports = router;