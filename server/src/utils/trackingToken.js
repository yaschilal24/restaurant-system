const crypto = require('crypto');
module.exports = {
  generateTrackingToken: () => crypto.randomBytes(24).toString('hex'),
  generateOrderNumber: () => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `ORD-${ts}-${rand}`;
  },
  generateQrToken: () => crypto.randomBytes(16).toString('hex'),
};