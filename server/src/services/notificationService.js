// Placeholder for future email/SMS notifications
module.exports = {
  async sendOrderConfirmation(order) {
    // TODO: integrate with Twilio/Email
    console.log(`📨 Order ${order.order_number} confirmed`);
  },
  async sendStatusUpdate(order, status) {
    console.log(`📨 Order ${order.order_number} → ${status}`);
  },
};