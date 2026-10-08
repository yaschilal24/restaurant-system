const { taxRate } = require('../config/env');

function calculateTotals(items) {
  const subtotal = items.reduce((s, i) => s + Number(i.unit_price_snapshot) * i.quantity, 0);
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  return { subtotal, tax, total };
}
module.exports = { calculateTotals };