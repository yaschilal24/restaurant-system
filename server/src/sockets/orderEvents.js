const { ROOMS } = require('./socketRooms');

let io = null;

function setIO(server) { io = server; }

function emitNewOrder(order) {
  if (io) io.to(ROOMS.STAFF).emit('order:new', order);
}

function emitOrderUpdate(payload) {
  if (!io) return;
  io.to(ROOMS.STAFF).emit('order:updated', payload);
  if (payload.trackingToken) {
    io.to(ROOMS.order(payload.trackingToken)).emit('order:updated', payload);
  }
}

module.exports = { setIO, emitNewOrder, emitOrderUpdate };