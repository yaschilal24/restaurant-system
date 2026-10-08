const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { register: regV, login: logV } = require('../validators/authValidator');

const router = express.Router();
router.post('/register', regV, validate, register);
router.post('/login', authLimiter, logV, validate, login);
router.get('/me', authenticate, me);
module.exports = router;