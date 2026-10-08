import api from './axios';
export const paymentApi = {
  initializeChapa: (orderId) => api.post('/payments/chapa/initialize', { orderId }),
  verifyPayment: (reference) => api.get(`/payments/verify/${reference}`),
  list: (params) => api.get('/payments', { params }),
};