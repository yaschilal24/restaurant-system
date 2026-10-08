const { verifyToken } = require('../utils/jwt');

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    try { socket.user = verifyToken(token); }
    catch { socket.user = null; }
  }
  next();
};