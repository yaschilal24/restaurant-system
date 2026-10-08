const { Server } = require('socket.io');
const { clientUrl } = require('../config/env');
const socketAuth = require('./socketAuth');
const { joinStaffRoom, joinOrderRoom } = require('./socketRooms');
const { setIO } = require('./orderEvents');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl, methods: ['GET', 'POST'], credentials: true },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    joinStaffRoom(socket);
    socket.on('join-order', (token) => joinOrderRoom(socket, token));
  });

  setIO(io);
  return io;
}

// Re-export event emitters
const { emitNewOrder, emitOrderUpdate } = require('./orderEvents');

module.exports = { initSocket, emitNewOrder, emitOrderUpdate };