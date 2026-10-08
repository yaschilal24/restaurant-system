const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};
module.exports = {
  VALID_TRANSITIONS,
  canTransition: (from, to) => VALID_TRANSITIONS[from]?.includes(to) ?? false,
  getNextStatuses: (current) => VALID_TRANSITIONS[current] || [],
};