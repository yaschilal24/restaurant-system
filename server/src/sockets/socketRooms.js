const ROOMS = {
  STAFF: 'staff',
  order: (token) => `order:${token}`,
};

function joinStaffRoom(socket) {
  if (socket.user && ['staff', 'admin'].includes(socket.user.role)) {
    socket.join(ROOMS.STAFF);
  }
}

function joinOrderRoom(socket, trackingToken) {
  if (trackingToken) socket.join(ROOMS.order(trackingToken));
}

module.exports = { ROOMS, joinStaffRoom, joinOrderRoom };