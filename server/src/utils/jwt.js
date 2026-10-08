const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
module.exports = {
  signToken: (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn }),
  verifyToken: (token) => jwt.verify(token, jwtSecret),
};